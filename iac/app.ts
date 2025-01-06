import * as cdk from "aws-cdk-lib";
import { IacStack } from "./stacks/iac_stack";

console.log("Starting the CDK");

const app = new cdk.App();

const awsRegion = process.env.AWS_REGION as string;
const awsAccountId = process.env.AWS_ACCOUNT_ID as string;
const stackName = process.env.STACK_NAME as string;
const github_ref_name = process.env.GITHUB_REF_NAME as string;

let stage = "TEST";

if (github_ref_name.includes("prod")) {
  stage = "PROD";
} else if (github_ref_name.includes("homolog")) {
  stage = "HOMOLOG";
} else if (github_ref_name.includes("dev")) {
  stage = "DEV";
}

const tags = {
  project: "AppRole",
  stage: stage,
  stack: "BACK",
  owner: "AppRole",
};

new IacStack(app, stackName, {
  env: {
    region: awsRegion,
    account: awsAccountId,
  },
  tags: tags,
});

app.synth();
