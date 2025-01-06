/// <reference path="./envs.d.ts" />

import { config } from "dotenv";
import path from "path";

config({ path: path.resolve(__dirname, "../../.env") });

export const envs = {
  STAGE: process.env.STAGE,
  GITHUB_REF_NAME: process.env.GITHUB_REF_NAME,
  AWS_REGION: process.env.AWS_REGION,
  APP_CLIENT_ID: process.env.APP_CLIENT_ID,
  USER_POOL_ID: process.env.USER_POOL_ID,
  USER_POOL_ARN: process.env.USER_POOL_ARN,
  MONGO_URI: process.env.MONGO_URI,
  BUCKET_NAME: process.env.BUCKET_NAME,
  AWS_ACCOUNT_ID: process.env.AWS_ACCOUNT_ID,
  STACK_NAME: process.env.STACK_NAME,
};
