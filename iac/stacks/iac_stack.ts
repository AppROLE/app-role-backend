import * as cdk from "aws-cdk-lib";
import * as iam from "aws-cdk-lib/aws-iam";
import { Construct } from "constructs";
import { stage } from "../get_stage_env";
import { LambdaStack } from "./lambda_stack";
import { CognitoStack } from "./cognito_stack";
import { Stack, StackProps } from "aws-cdk-lib";
import {
  Cors,
  RestApi,
  CognitoUserPoolsAuthorizer,
} from "aws-cdk-lib/aws-apigateway";
import * as cognito from "aws-cdk-lib/aws-cognito";
import * as iam from "aws-cdk-lib/aws-iam";
import { S3Stack } from "./s3_stack";
import { Distribution, OriginAccessIdentity } from "aws-cdk-lib/aws-cloudfront";

export class IacStack extends Stack {
  constructor(scope: Construct, constructId: string, props?: StackProps) {
    super(scope, constructId, props);

    const restApi = new RestApi(this, `${envs.STACK_NAME}-RestAPI`, {
      restApiName: `${envs.STACK_NAME}-RestAPI`,
      description: "This is the REST API for the AppRole Event MSS Service.",
      defaultCorsPreflightOptions: {
        allowOrigins: Cors.ALL_ORIGINS,
        allowMethods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
        allowHeaders: ["*"],
      },
      binaryMediaTypes: ["multipart/form-data"],
    });

    const apigatewayResource = restApi.root.addResource("mss-role", {
      defaultCorsPreflightOptions: {
        allowOrigins: Cors.ALL_ORIGINS,
        allowMethods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
        allowHeaders: Cors.DEFAULT_HEADERS,
      },
    });

    const s3Stack = new S3Stack(this, `${envs.STACK_NAME}-S3Stack`);

    const s3Policy = new iam.PolicyStatement({
      effect: iam.Effect.ALLOW,
      actions: [
        "s3:PutObject",
        "s3:GetObject",
        "s3:DeleteObject",
        "s3:ListBucket",
      ],
      resources: [s3Stack.bucket.bucketArn, `${s3Stack.bucket.bucketArn}/*`],
    });

    const originAccessIdentity = new OriginAccessIdentity(
      this,
      "AppRoleFrontOAI",
      {
        comment: "OAI for S3 bucket",
      }
    );

    const distribution = new Distribution(this, "AppRoleFrontDistribution", {
      defaultBehavior: {
        origin: new cdk.aws_cloudfront_origins.S3Origin(s3Stack.bucket, {
          originAccessIdentity: originAccessIdentity,
        }),
        allowedMethods: cdk.aws_cloudfront.AllowedMethods.ALLOW_GET_HEAD,
        cachedMethods: cdk.aws_cloudfront.CachedMethods.CACHE_GET_HEAD,
        viewerProtocolPolicy:
          cdk.aws_cloudfront.ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
        cachePolicy: cdk.aws_cloudfront.CachePolicy.CACHING_OPTIMIZED,
      },
    });

    distribution.applyRemovalPolicy(cdk.RemovalPolicy.DESTROY);

    s3Stack.bucket.addToResourcePolicy(
      new iam.PolicyStatement({
        effect: iam.Effect.ALLOW,
        actions: ["s3:GetObject"],
        resources: [s3Stack.bucket.arnForObjects("*")],
        principals: [
          new iam.ServicePrincipal("cloudfront.amazonaws.com", {
            conditions: {
              StringEquals: {
                "AWS:SourceArn": `arn:aws:cloudfront::${this.account}:distribution/${distribution.distributionId}`,
              },
            },
          }),
        ],
      })
    );

    const cloudfrontPolicy = new iam.PolicyStatement({
      effect: iam.Effect.ALLOW,
      actions: ["cloudfront:CreateInvalidation"],
      resources: ["*"],
    });

    const cognitoStack = new CognitoStack(
      this,
      `${Environments.STACK_NAME}-CognitoStack`
    );

    const authorizer = new cdk.aws_apigateway.CognitoUserPoolsAuthorizer(
      this,
      `${Environments.STACK_NAME}-Authorizer`,
      {
        cognitoUserPools: [cognitoStack.userPool],
        identitySource: "method.request.header.Authorization",
      }
    );

    const environmentVariables = {
      STAGE: stage,
      NODE_PATH: "/var/task:/opt/nodejs",
      MONGO_URI: Environments.MONGO_URI,
      S3_BUCKET_NAME: Environments.S3_BUCKET_NAME + stage.toLowerCase(),
      CLOUD_FRONT_URL: distribution.domainName,
      CLOUDFRONT_ID: distribution.distributionId,
      COGNITO_USER_POOL_ID: cognitoStack.userPool.userPoolId,
      COGNITO_CLIENT_ID: cognitoStack.client.userPoolClientId,
    };

    const lambdaStack = new LambdaStack(
      this,
      apigatewayResource,
      environmentVariables,
      authorizer
    );

    const cognitoAdminPolicy = new iam.PolicyStatement({
      effect: iam.Effect.ALLOW,
      actions: ["cognito-idp:*"],
      resources: [cognitoStack.userPool.userPoolArn],
    });

    for (const fn of lambdaStack.functionsThatNeedCognitoPermissions) {
      fn.addToRolePolicy(cognitoAdminPolicy);
    }

    for (const fn of lambdaStack.functionsThatNeedS3Permissions) {
      fn.addToRolePolicy(s3Policy);
    }
  }
}
