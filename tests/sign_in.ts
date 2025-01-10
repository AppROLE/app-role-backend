import {
  CognitoIdentityProviderClient,
  SignUpCommand,
  SignUpCommandInput,
  AdminInitiateAuthCommand,
  AdminInitiateAuthCommandInput,
  AdminGetUserCommand,
  AdminGetUserCommandInput,
  ResendConfirmationCodeCommand,
  ResendConfirmationCodeCommandInput,
  ForgotPasswordCommand,
  ForgotPasswordCommandInput,
  ConfirmForgotPasswordCommand,
  ConfirmForgotPasswordCommandInput,
  ConfirmSignUpCommand,
  ConfirmSignUpCommandInput,
  InitiateAuthCommand,
  InitiateAuthCommandInput,
  AdminDeleteUserCommand,
  AdminDeleteUserCommandInput,
  AdminUpdateUserAttributesCommand,
  AdminUpdateUserAttributesCommandInput,
  CognitoIdentityProviderServiceException,
  UpdateUserAttributesCommandInput,
} from '@aws-sdk/client-cognito-identity-provider';
import { randomUUID } from 'crypto';
import { config } from 'dotenv';
import path from 'path';
config({ path: path.resolve(__dirname, '../.env') });

async function main() {
  const client = new CognitoIdentityProviderClient({
    region: process.env.AWS_REGION,
  });

  const params: InitiateAuthCommandInput = {
    ClientId: process.env.APP_CLIENT_ID,
    AuthFlow: 'USER_PASSWORD_AUTH',
    AuthParameters: {
      USERNAME: 'gabriel.godoybz@gmail.com',
      PASSWORD: 'Teste123!',
    },
  };

  const command = new InitiateAuthCommand(params);
  const result = await client.send(command);

  console.log(result);
}

main();
