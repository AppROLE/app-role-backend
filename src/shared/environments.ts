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
  static bucketName: string =
    (process.env.BUCKET_NAME as string) || "bucket-test";
  static region: string = (process.env.AWS_REGION as string) || "sa-east-1";
  static dbUrl: string = (process.env.MONGO_URI as string) || "";
  static userPoolArn: string = (process.env.USER_POOL_ARN as string) || "";
  static userPoolName: string = (process.env.USER_POOL_NAME as string) || "";
  static userPoolId: string = (process.env.USER_POOL_ID as string) || "";
  static appClientId: string = (process.env.APP_CLIENT_ID as string) || "";
}
