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
  InitiateAuthCommand,
  InitiateAuthCommandInput,
  AdminDeleteUserCommand,
  AdminDeleteUserCommandInput,
  AdminUpdateUserAttributesCommand,
  AdminUpdateUserAttributesCommandInput,
  CognitoIdentityProviderServiceException,
} from "@aws-sdk/client-cognito-identity-provider";

import { ConflictItems, EntityError, ForbiddenAction, PasswordDoesNotMatchError, RequestUserToForgotPassword, UserAlreadyExists, UserNotConfirmed, UserNotRegistered } from "src/shared/helpers/errors/errors";
import { InvalidCredentialsError } from "src/shared/helpers/errors/errors";
import { CognitoError, NoItemsFound } from "src/shared/helpers/errors/errors";
import { Environments } from "src/shared/environments";
import { ROLE_TYPE } from "src/shared/domain/enums/role_type_enum";
import { User } from "src/shared/domain/entities/user";
import { UserCognitoDTO } from "../dtos/user_cognito_dto";

export class AuthRepositoryCognito {
  private userPoolId: string;
  private appClientId: string;
  private client: CognitoIdentityProviderClient;

  constructor() {
    this.userPoolId = Environments.userPoolId;
    this.appClientId = Environments.appClientId;
    this.client = new CognitoIdentityProviderClient({
      region: Environments.region,
    });
  }

  private handleError(error: any, methodName: string): never {
    console.error(`Error in ${methodName}:`, error.message);

    if (error instanceof CognitoIdentityProviderServiceException) {
      switch (error.name) {
        case "NotAuthorizedException":
          throw new InvalidCredentialsError();
        case "UserNotFoundException":
          throw new UserNotRegistered();
        case "UserAlreadyExistsException":
          throw new UserAlreadyExists();
        case "UserNotConfirmedException":
          throw new UserNotConfirmed();
        case "InvalidParameterException":
          throw new EntityError("Invalid parameter");
        case "InvalidPasswordException":
          throw new PasswordDoesNotMatchError();
        case "CodeMismatchException":
          throw new EntityError("Invalid confirmation code");
        case "ExpiredCodeException":
          throw new EntityError("Expired confirmation code");
        case "LimitExceededException":
          throw new ForbiddenAction("API request limit exceeded");
        case "TooManyRequestsException":
          throw new ForbiddenAction("Too many requests, please slow down");
        case "ResourceNotFoundException":
          throw new NoItemsFound("Resource not found");
        case "AliasExistsException":
          throw new ConflictItems("Alias already exists");
        case "InternalErrorException":
          throw new CognitoError("Internal server error");
        case "PasswordResetRequiredException":
          throw new RequestUserToForgotPassword();
        case "UsernameExistsException":
          throw new UserAlreadyExists();
        case "UserLambdaValidationException":
          throw new CognitoError("Lambda validation error");
        case "InvalidLambdaResponseException":
          throw new CognitoError("Invalid response from Lambda trigger");
        case "UnexpectedLambdaException":
          throw new CognitoError("Unexpected Lambda trigger error");
        case "MFAMethodNotFoundException":
          throw new ForbiddenAction("MFA method not found");
        case "SoftwareTokenMFANotFoundException":
          throw new ForbiddenAction("Software token MFA not configured");
        case "EnableSoftwareTokenMFAException":
          throw new ForbiddenAction("Unable to enable Software token MFA");
        case "UserPoolTaggingException":
          throw new CognitoError("User Pool tagging error");
        case "InvalidSmsRoleAccessPolicyException":
          throw new CognitoError("Invalid SMS role access policy");
        case "InvalidSmsRoleTrustRelationshipException":
          throw new CognitoError("Invalid SMS role trust relationship");
        case "UserImportInProgressException":
          throw new ForbiddenAction("User import in progress");
        case "InvalidUserPoolConfigurationException":
          throw new CognitoError("Invalid User Pool configuration");
        case "SoftwareTokenMFANotEnabledException":
          throw new ForbiddenAction("Software token MFA not enabled");
        case "TooManyFailedAttemptsException":
          throw new ForbiddenAction("Too many failed attempts");
        default:
          throw new CognitoError(`${methodName} - ${error.message}`);
      }
    }

    throw new CognitoError(`${methodName} - ${error.message}`);
  }

  async signUp(name: string, email: string, password: string, role: ROLE_TYPE): Promise<User> {
    try {
      const params: SignUpCommandInput = {
        ClientId: this.appClientId,
        Password: password,
        Username: email,
        UserAttributes: [
          { Name: "name", Value: name },
          { Name: "email", Value: email },
          { Name: "custom:role", Value: role },
        ],
      };

      const command = new SignUpCommand(params);
      const response = await this.client.send(command);

      return UserCognitoDTO.fromCognito(response).toEntity();
    } catch (error) {
      this.handleError(error, "signUp");
    }
  }

  async signIn(email: string, password: string) {
    try {
      const params: AdminInitiateAuthCommandInput = {
        UserPoolId: this.userPoolId,
        ClientId: this.appClientId,
        AuthFlow: "USER_PASSWORD_AUTH",
        AuthParameters: { USERNAME: email, PASSWORD: password },
      };

      const command = new AdminInitiateAuthCommand(params);
      const result = await this.client.send(command);

      if (!result.AuthenticationResult) {
        throw new Error("Authentication failed, no tokens returned");
      }

      const { AccessToken, IdToken, RefreshToken } = result.AuthenticationResult;

      return {
        accessToken: AccessToken || "",
        idToken: IdToken || "",
        refreshToken: RefreshToken || "",
      };
    } catch (error) {
      this.handleError(error, "signIn");
    }
  }

  async resendCode(email: string): Promise<void> {
    try {
      const params: ResendConfirmationCodeCommandInput = {
        ClientId: this.appClientId,
        Username: email,
      };

      const command = new ResendConfirmationCodeCommand(params);
      await this.client.send(command);
    } catch (error) {
      this.handleError(error, "resendCode");
    }
  }

  async getUserByEmail(email: string): Promise<User | null> {
    try {
      const command = new AdminGetUserCommand({
        UserPoolId: this.userPoolId,
        Username: email,
      });

      const response = await this.client.send(command);

      if (!response.UserAttributes) {
        return null;
      }

      return UserCognitoDTO.fromCognito(response).toEntity();
    } catch (error) {
      this.handleError(error, "getUserByEmail");
    }
  }

  async forgotPassword(email: string): Promise<void> {
    try {
      const params: ForgotPasswordCommandInput = {
        ClientId: this.appClientId,
        Username: email,
      };

      const command = new ForgotPasswordCommand(params);
      await this.client.send(command);
    } catch (error) {
      this.handleError(error, "forgotPassword");
    }
  }

  async confirmForgotPassword(email: string, newPassword: string, code: string): Promise<void> {
    try {
      const params: ConfirmForgotPasswordCommandInput = {
        ClientId: this.appClientId,
        Username: email,
        ConfirmationCode: code,
        Password: newPassword,
      };

      const command = new ConfirmForgotPasswordCommand(params);
      await this.client.send(command);
    } catch (error) {
      this.handleError(error, "confirmForgotPassword");
    }
  }

  async deleteAccount(username: string, password: string) {
    try {
      const authParams: AdminInitiateAuthCommandInput = {
        UserPoolId: this.userPoolId,
        ClientId: this.appClientId,
        AuthFlow: "ADMIN_NO_SRP_AUTH",
        AuthParameters: { USERNAME: username, PASSWORD: password },
      };

      const authCommand = new AdminInitiateAuthCommand(authParams);
      await this.client.send(authCommand);

      const deleteCommand = new AdminDeleteUserCommand({
        UserPoolId: this.userPoolId,
        Username: username,
      });

      await this.client.send(deleteCommand);
    } catch (error) {
      this.handleError(error, "deleteAccount");
    }
  }

  async adminUpdateUser(email: string, newRole: string): Promise<void> {
    try {
      const params: AdminUpdateUserAttributesCommandInput = {
        UserPoolId: this.userPoolId,
        Username: email,
        UserAttributes: [{ Name: "custom:role", Value: newRole }],
      };

      const command = new AdminUpdateUserAttributesCommand(params);
      await this.client.send(command);
    } catch (error) {
      this.handleError(error, "adminUpdateUser");
    }
  }
}
