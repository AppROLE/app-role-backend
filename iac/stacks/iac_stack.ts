import { Construct } from "constructs";
import { stage } from "../get_stage_env";
import { LambdaStack } from "./lambda_stack";
import { Stack, StackProps } from "aws-cdk-lib";
import { envs } from "../../src/shared/helpers/envs/envs";
import {
  Cors,
  RestApi,
  CognitoUserPoolsAuthorizer,
} from "aws-cdk-lib/aws-apigateway";
import * as cognito from "aws-cdk-lib/aws-cognito";
import * as iam from "aws-cdk-lib/aws-iam";

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

    const apigatewayResource = restApi.root.addResource("mss-role-event", {
      defaultCorsPreflightOptions: {
        allowOrigins: Cors.ALL_ORIGINS,
        allowMethods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
        allowHeaders: Cors.DEFAULT_HEADERS,
      },
    });

    let userPoolId = "";

    if (stage === "DEV") userPoolId = envs.AWS_COGNITO_USER_POOL_ID_DEV;
    if (stage === "PROD") userPoolId = envs.AWS_COGNITO_USER_POOL_ID_PROD;
    if (stage === "HOMOLOG") userPoolId = envs.AWS_COGNITO_USER_POOL_ID_HOMOLOG;

    const userpool = cognito.UserPool.fromUserPoolId(
      this,
      `${envs.STACK_NAME}-UserPool`,
      userPoolId
    );

    const authorizer = new CognitoUserPoolsAuthorizer(
      this,
      `${envs.STACK_NAME}-Authorizer`,
      {
        cognitoUserPools: [userpool],
        identitySource: "method.request.header.Authorization",
      }
    );

    let cloudFrontUrl = "";
    if (stage === "DEV") cloudFrontUrl = envs.CLOUD_FRONT_URL_DEV;
    if (stage === "PROD") cloudFrontUrl = envs.CLOUD_FRONT_URL_PROD;
    if (stage === "HOMOLOG") cloudFrontUrl = envs.CLOUD_FRONT_URL_HOMOLOG;

    const environmentVariables = {
      STAGE: stage,
      NODE_PATH: "/var/task:/opt/nodejs",
      EMAIL_LOGIN: envs.EMAIL_LOGIN,
      EMAIL_PASSWORD: envs.EMAIL_PASSWORD,
      MONGO_URI: envs.MONGO_URI,
      S3_BUCKET_NAME: envs.S3_BUCKET_NAME + stage.toLowerCase(),
      CLOUD_FRONT_URL: cloudFrontUrl,
    };

    const lambdaStack = new LambdaStack(
      this,
      apigatewayResource,
      environmentVariables,
      authorizer
    );

    const s3Policy = new iam.PolicyStatement({
      effect: iam.Effect.ALLOW,
      actions: [
        "s3:ListBucket", // Listar o bucket
        "s3:GetObject",  // Obter objetos do bucket
        "s3:DeleteObject", // Deletar objetos do bucket
        "s3:PutObject",  // Fazer upload de objetos no bucket (permite PUT)
      ],
      resources: [
        `arn:aws:s3:::${envs.S3_BUCKET_NAME}${stage.toLowerCase()}`,   // O bucket (sem o /*)
        `arn:aws:s3:::${envs.S3_BUCKET_NAME}${stage.toLowerCase()}/*`, // Objetos dentro do bucket
        `arn:aws:s3:::${envs.S3_BUCKET_NAME}${stage.toLowerCase()}/*/*`, // Objetos dentro do bucket
      ],
    });
    

    for (const fn of lambdaStack.functionsThatNeedS3Permissions) {
      fn.addToRolePolicy(s3Policy);
    }
  }
}
