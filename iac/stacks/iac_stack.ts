import * as cdk from 'aws-cdk-lib';
import * as iam from 'aws-cdk-lib/aws-iam';
import { Construct } from 'constructs';
import { LambdaStack } from './lambda_stack';
import { Stack, StackProps } from 'aws-cdk-lib';
import { Cors, RestApi } from 'aws-cdk-lib/aws-apigateway';
import * as cognito from 'aws-cdk-lib/aws-cognito';
import * as s3 from 'aws-cdk-lib/aws-s3';
import { envs } from '../envs/envs';

export class IacStack extends Stack {
  constructor(scope: Construct, constructId: string, props?: StackProps) {
    super(scope, constructId, props);

    const restApi = new RestApi(this, `${constructId}-RestAPI`, {
      restApiName: `${constructId}-RestAPI`,
      description: 'This is the REST API for the AppRole Event MSS Service.',
      defaultCorsPreflightOptions: {
        allowOrigins: Cors.ALL_ORIGINS,
        allowMethods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
        allowHeaders: ['*'],
      },
      binaryMediaTypes: ['multipart/form-data'],
    });

    const apigatewayResource = restApi.root.addResource('mss-role', {
      defaultCorsPreflightOptions: {
        allowOrigins: Cors.ALL_ORIGINS,
        allowMethods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
        allowHeaders: Cors.DEFAULT_HEADERS,
      },
    });

    const userPool = cognito.UserPool.fromUserPoolId(
      this,
      `${constructId}-UserPool`,
      envs.USER_POOL_ID
    );

    const authorizer = new cdk.aws_apigateway.CognitoUserPoolsAuthorizer(
      this,
      `${constructId}-Authorizer`,
      {
        cognitoUserPools: [userPool],
        identitySource: 'method.request.header.Authorization',
      }
    );

    const environmentVariables = {
      STAGE: envs.STAGE,
      NODE_PATH: '/var/task:/opt/nodejs',
      REGION: envs.AWS_REGION,
      MONGO_URI: envs.MONGO_URI,
      BUCKET_NAME: envs.BUCKET_NAME,
      USER_POOL_ID: envs.USER_POOL_ID,
      USER_POOL_ARN: envs.USER_POOL_ARN,
      APP_CLIENT_ID: envs.APP_CLIENT_ID,
    };

    const lambdaStack = new LambdaStack(
      this,
      apigatewayResource,
      environmentVariables,
      authorizer
    );

    const cognitoAdminPolicy = new iam.PolicyStatement({
      effect: iam.Effect.ALLOW,
      actions: ['cognito-idp:*'],
      resources: [envs.USER_POOL_ARN],
    });

    const existingBucket = s3.Bucket.fromBucketName(
      this,
      `${constructId}-ExistingBucket`,
      envs.BUCKET_NAME
    );

    const s3Policy = new iam.PolicyStatement({
      effect: iam.Effect.ALLOW,
      actions: [
        's3:PutObject',
        's3:GetObject',
        's3:DeleteObject',
        's3:ListBucket',
      ],
      resources: [existingBucket.bucketArn, `${existingBucket.bucketArn}/*`],
    });

    const rekognitionPolicy = new iam.PolicyStatement({
      effect: iam.Effect.ALLOW,
      actions: ['rekognition:DetectModerationLabels'],
      resources: ['*'],
    });

    for (const fn of lambdaStack.functionsThatNeedCognitoPermissions) {
      fn.addToRolePolicy(cognitoAdminPolicy);
    }

    for (const fn of lambdaStack.functionsThatNeedS3Permissions) {
      fn.addToRolePolicy(s3Policy);
      fn.addToRolePolicy(rekognitionPolicy);
    }
  }
}
