import { config } from "dotenv";
import path from "path";
config({ path: path.resolve(__dirname, "../../../../.env") });

export enum STAGE {
  PROD = "PROD",
  HOMOLOG = "HOMOLOG",
  DEV = "DEV",
  TEST = "TEST",
}

export class Environments {
  static stage: STAGE = (process.env.STAGE as STAGE) || STAGE.TEST;
  static s3BucketName: string =
    (process.env.S3_BUCKET_NAME as string) || "bucket-test";
  static region: string = (process.env.AWS_REGION as string) || "sa-east-1";
  static dbUrl: string = (process.env.MONGO_URI as string) || "";
  static clientId: string = (process.env.COGNITO_CLIENT_ID as string) || "";
  static userPoolId: string =
    (process.env.COGNITO_USER_POOL_ID as string) || "";
  static cloudFrontUrl: string = (process.env.CLOUD_FRONT_URL as string) || "";
  static cloudFrontId: string = (process.env.CLOUDFRONT_ID as string) || "";
}
