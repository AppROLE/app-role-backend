import * as cdk from "aws-cdk-lib";
import { IacStack } from "./stacks/iac_stack";
import { envs } from "./envs/envs";

const app = new cdk.App();

const awsRegion = envs.AWS_REGION;

if (!awsRegion) {
  throw new Error("AWS_REGION is not defined in the environment variables.");
}

const stackName = envs.STACK_NAME;

if (!stackName) {
  throw new Error("STACK_NAME is not defined in the environment variables.");
}

let stage = envs.STAGE || "TEST";

if (stage.includes("prod")) {
  stage = "PROD";
} else if (stage.includes("homolog")) {
  stage = "HOMOLOG";
} else if (stage.includes("dev")) {
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
  },
  tags: tags,
});

app.synth();
