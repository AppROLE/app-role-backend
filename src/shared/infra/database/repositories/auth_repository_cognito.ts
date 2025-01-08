import { generateConfirmationCode } from "../../../utils/generate_confirmation_code";
import { Profile } from "../../../domain/entities/profile";
import {
  AdminConfirmSignUpCommand,
  AdminConfirmSignUpCommandInput,
  AdminDeleteUserCommand,
  AdminDeleteUserCommandInput,
  AdminGetUserCommand,
  AdminGetUserCommandInput,
  AdminInitiateAuthCommand,
  AdminInitiateAuthCommandInput,
  AdminSetUserPasswordCommand,
  AdminSetUserPasswordCommandInput,
  AdminUpdateUserAttributesCommand,
  AdminUpdateUserAttributesCommandInput,
  CognitoIdentityProviderClient,
  CognitoIdentityProviderServiceException,
  InitiateAuthCommand,
  InitiateAuthCommandInput,
  ListUsersCommand,
  ListUsersCommandInput,
  SignUpCommand,
  SignUpCommandInput,
} from "@aws-sdk/client-cognito-identity-provider";
import { EntityError } from "src/shared/helpers/errors/domain_errors";
import { InvalidCredentialsError } from "src/shared/helpers/errors/login_errors";
import {
  DuplicatedItem,
  NoItemsFound,
} from "src/shared/helpers/errors/usecase_errors";
import { UserCognitoDTO } from "../../dto/user_cognito_dto";
import { IAuthRepository } from "src/shared/domain/repositories/auth_repository_interface";
import { Environments } from "src/shared/environments";

export class AuthRepositoryCognito implements IAuthRepository {
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

  async signUp(
    name: string,
    email: string,
    password: string
  ): Promise<{
    userId: string;
    name: string;
    email: string;
    role: string;
  }> {
    try {
      const params: SignUpCommandInput = {
        ClientId: this.appClientId,
        Password: password,
        Username: email,
        UserAttributes: [
          {
            Name: "STRING_VALUE",
            Value: "STRING_VALUE",
          },
        ],
        // ValidationData: [
        //   {
        //     Name: 'SupressEmail',
        //     Value: 'true'
        //   },
        //   {
        //     Name: 'SupressSMS',
        //     Value: 'true'
        //   }
        // ]
      };

      const command = new SignUpCommand(params);
      const result = await this.client.send(command);

      return user;
    } catch (error: any) {
      throw new Error(
        "AuthRepositoryCognito, Error on signUp: " + error.message
      );
    }
  }

  async resendCode(email: string): Promise<string> {
    const user = await this.getUserByEmail(email);

    const code = generateConfirmationCode();

    const params: AdminUpdateUserAttributesCommandInput = {
      UserPoolId: this.userPoolId,
      Username: user?.userUsername as string,
      UserAttributes: [
        {
          Name: "custom:confirmationCode",
          Value: code,
        },
      ],
    };

    const command = new AdminUpdateUserAttributesCommand(params);
    await this.client.send(command);

    return code;
  }

  async forgotPassword(email: string, code: string): Promise<string> {
    try {
      await this.updateUserConfirmationCode(email, code);
      return "";
    } catch (error: any) {
      throw new Error(
        "AuthRepositoryCognito, Error on forgotPassword: " + error.message
      );
    }
  }

  async updatePassword(email: string, newPassword: string): Promise<void> {
    try {
      const user = await this.getUserByEmail(email);

      if (!user) {
        throw new Error("Usuário não encontrado.");
      }

      const params: AdminSetUserPasswordCommandInput = {
        UserPoolId: this.userPoolId,
        Username: user.userUsername as string,
        Password: newPassword,
        Permanent: true,
      };

      const command = new AdminSetUserPasswordCommand(params);
      await this.client.send(command);
    } catch (error: any) {
      throw new Error(
        `AuthRepositoryCognito, Error on updatePassword: ${error.message}`
      );
    }
  }

  async updateEmail(currentEmail: string, newEmail: string): Promise<void> {
    try {
      const user = await this.getUserByEmail(currentEmail);

      if (!user) {
        throw new Error("Usuário não encontrado.");
      }

      const params: AdminUpdateUserAttributesCommandInput = {
        UserPoolId: this.userPoolId,
        Username: user.userUsername as string,
        UserAttributes: [
          {
            Name: "email",
            Value: newEmail,
          },
        ],
      };

      const command = new AdminUpdateUserAttributesCommand(params);
      await this.client.send(command);
    } catch (error: any) {
      throw new Error(
        `AuthRepositoryCognito, Error on updateEmail: ${error.message}`
      );
    }
  }

  async updateUserConfirmationCode(
    email: string,
    confirmationCode: string
  ): Promise<void> {
    const user = await this.getUserByEmail(email);

    if (!user) {
      throw new Error("Usuário não encontrado.");
    }

    const params: AdminUpdateUserAttributesCommandInput = {
      UserPoolId: this.userPoolId,
      Username: user.userUsername as string,
      UserAttributes: [
        {
          Name: "custom:confirmationCode",
          Value: confirmationCode,
        },
      ],
    };

    const command = new AdminUpdateUserAttributesCommand(params);
    await this.client.send(command);
  }

  async getUserByEmail(email: string): Promise<Profile | null> {
    try {
      const command = new AdminGetUserCommand({
        UserPoolId: this.userPoolId,
        Username: email,
      });

      const response = await this.client.send(command);

      if (response.UserStatus === "UNCONFIRMED") {
        return null;
      }

      const user = UserCognitoDTO.fromCognito(response).toEntity();
      user.systems = await this.getGroupsForUser(email);

      return user;
    } catch (error: any) {
      if (error.name === "UserNotFoundException") {
        return null;
      }
      throw error;
    }
  }

  async getUserByEmail(email: string): Promise<
    | {
        userId: string;
        email: string;
        name: string;
        username: string;
        role: string;
        emailVerified: boolean;
      }
    | undefined
  > {
    try {
      const params: ListUsersCommandInput = {
        UserPoolId: this.userPoolId,
        Filter: `email = "${email}"`,
      };
      const command = new ListUsersCommand(params);
      const result = await this.client.send(command);

      if (result.Users && result.Users.length > 0) {
        const userAttrsCog = result.Users[0];
        const username = userAttrsCog.Username;
        if (!username) return undefined;

        const dto = UserCognitoDTO.fromCognitoAttributes(
          userAttrsCog.Attributes
        );
        return dto.toJson();
      }
      return undefined;
    } catch (error: any) {
      throw new Error(
        "AuthRepositoryCognito, Error on getUserByEmail: " + error.message
      );
    }
  }

  async signIn(
    email: string,
    password: string
  ): Promise<{
    accessToken: string;
    idToken: string;
    refreshToken: string;
  }> {
    try {
      const params: AdminInitiateAuthCommandInput = {
        UserPoolId: this.userPoolId,
        ClientId: this.appClientId,
        AuthFlow: "USER_PASSWORD_AUTH",
        AuthParameters: {
          USERNAME: email,
          PASSWORD: password,
        },
      };

      const command = new AdminInitiateAuthCommand(params);
      const result = await this.client.send(command);

      if (!result.AuthenticationResult) {
        console.error(
          "AuthenticationResult is missing in the response:",
          result
        );
        throw new Error("Authentication failed, no tokens returned");
      }

      const { AccessToken, IdToken, RefreshToken } =
        result.AuthenticationResult;

      return {
        accessToken: AccessToken || "",
        idToken: IdToken || "",
        refreshToken: RefreshToken || "",
      };
    } catch (error: any) {
      const errorCode: CognitoIdentityProviderServiceException = error;

      console.error(
        `Error during signIn: ${error.message}, Code: ${errorCode}`
      );
      if (
        errorCode.name === "NotAuthorizedException" ||
        errorCode.name === "UserNotFoundException"
      ) {
        throw new InvalidCredentialsError();
      } else if (errorCode.name === "UserNotConfirmedException") {
        throw new Error("User not confirmed");
      } else if (errorCode.name === "ResourceNotFoundException") {
        throw new NoItemsFound("User");
      } else if (errorCode.name === "InvalidParameterException") {
        throw new EntityError("password");
      } else {
        throw new InvalidCredentialsError();
      }
    }
  }

  async refreshToken(refreshToken: string): Promise<{
    accessToken: string;
    idToken: string;
    refreshToken: string;
  }> {
    try {
      const params: InitiateAuthCommandInput = {
        ClientId: this.appClientId,
        AuthFlow: "REFRESH_TOKEN_AUTH",
        AuthParameters: {
          REFRESH_TOKEN: refreshToken,
        },
      };

      const command = new InitiateAuthCommand(params);

      const result = await this.client.send(command);

      if (!result.AuthenticationResult) {
        console.error(
          "AuthenticationResult is missing in the response:",
          result
        );
        throw new Error("Authentication failed, no tokens returned");
      }

      const { AccessToken, IdToken } = result.AuthenticationResult;

      return {
        accessToken: AccessToken || "",
        idToken: IdToken || "",
        refreshToken,
      };
    } catch (error: any) {
      throw new Error(`Error during refreshToken: ${error.message}`);
    }
  }

  async adminUpdateUser(email: string, newRole: string): Promise<void> {
    try {
      const params: AdminUpdateUserAttributesCommandInput = {
        UserPoolId: this.userPoolId,
        Username: email,
        UserAttributes: [
          {
            Name: "custom:role",
            Value: newRole,
          },
        ],
      };

      const command = new AdminUpdateUserAttributesCommand(params);

      await this.client.send(command);
    } catch (error: any) {
      throw new Error(
        "AuthRepositoryCognito, Error on adminUpdateUser: " + error.message
      );
    }
  }

  async deleteAccount(username: string, password: string) {
    try {
      const authParams: AdminInitiateAuthCommandInput = {
        UserPoolId: this.userPoolId,
        ClientId: this.appClientId,
        AuthFlow: "ADMIN_NO_SRP_AUTH",
        AuthParameters: {
          USERNAME: username,
          PASSWORD: password,
        },
      };

      const authCommand = new AdminInitiateAuthCommand(authParams);

      const authResponse = await this.client.send(authCommand);

      if (!authResponse.AuthenticationResult) {
        throw new Error("Authentication failed. Invalid password.");
      }

      const deleteParams: AdminDeleteUserCommandInput = {
        UserPoolId: this.userPoolId,
        Username: username,
      };

      const deleteCommand = new AdminDeleteUserCommand(deleteParams);

      await this.client.send(deleteCommand);

      console.log("DELETED USER AFTER SEND: ", username);
    } catch (error: any) {
      throw new Error(
        "AuthRepositoryCognito, Error on deleteAccount: " + error.message
      );
    }
  }
}
