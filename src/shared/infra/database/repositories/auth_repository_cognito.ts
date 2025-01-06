import { generateConfirmationCode } from "../../../utils/generate_confirmation_code";
import { User } from "../../../domain/entities/user";
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
import { ChangeUsernameReturnType } from "src/shared/helpers/types/change_username_return_type";
import { UserCognitoDTO } from "../../dto/user_cognito_dto";
import { IAuthRepository } from "src/shared/domain/repositories/auth_repository_interface";
import { Environments } from "src/shared/environments";

export class AuthRepositoryCognito implements IAuthRepository {
  userPoolId: string;
  appClientId: string;
  client: CognitoIdentityProviderClient;

  constructor() {
    this.userPoolId = Environments.userPoolId;
    this.appClientId = Environments.appClientId;
    this.client = new CognitoIdentityProviderClient({
      region: Environments.region,
    });
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
          {
            Name: "email_verified",
            Value: "true",
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

  async getUserByEmail(email: string): Promise<User | undefined> {
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
          username,
          userAttrsCog.Attributes
        );
        return dto.toEntity();
      }
      return undefined;
    } catch (error: any) {
      throw new Error(
        "AuthRepositoryCognito, Error on getUserByEmail: " + error.message
      );
    }
  }

  async signUp(
    name: string,
    email: string,
    password: string,
    acceptedTerms: boolean
  ): Promise<{
    userId: string,
    name: string,
    email: string,
    role: string,
  }> {
    try {
      const user = new User({
        name,
        email,
        password,
        username: email,
        acceptedTerms,
        nickname: name.split(" ")[0],
        emailVerified: false,
        confirmationCode: generateConfirmationCode(),
      });

      const dto = UserCognitoDTO.fromEntity(user);
      const userAttributes = dto.toCognitoAttributes();

      const params: SignUpCommandInput = {
        ClientId: this.appClientId,
        Password: password,
        Username: email,
        UserAttributes: userAttributes,
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

      console.log("SIGN UP RESULT: ", result);

      return user;
    } catch (error: any) {
      throw new Error(
        "AuthRepositoryCognito, Error on signUp: " + error.message
      );
    }
  }

  async confirmCode(
    email: string,
    code: string
  ): Promise<{ user: User; code: string } | undefined> {
    try {
      const user = await this.getUserByEmail(email);

      if (!user) {
        throw new NoItemsFound("usuário");
      }

      const params: AdminGetUserCommandInput = {
        UserPoolId: this.userPoolId,
        Username: user.userUsername as string,
      };

      const command = new AdminGetUserCommand(params);
      const result = await this.client.send(command);

      if (!result.UserAttributes || !result.Username) {
        return undefined;
      }

      const isUserEmailVerified = result.UserAttributes.find(
        (attr) => attr.Name === "email_verified"
      )?.Value;

      const dto = UserCognitoDTO.fromCognitoAttributes(
        result.Username,
        result.UserAttributes
      );
      const userEntity = dto.toEntity();

      if (userEntity.userConfirmationCode !== code) {
        return undefined;
      }

      if (isUserEmailVerified === "false") {
        const paramsConfirmEmail: AdminUpdateUserAttributesCommandInput = {
          UserPoolId: this.userPoolId,
          Username: user.userUsername as string,
          UserAttributes: [
            {
              Name: "email_verified",
              Value: "true",
            },
          ],
        };

        const commandConfirmEmail = new AdminUpdateUserAttributesCommand(
          paramsConfirmEmail
        );
        await this.client.send(commandConfirmEmail);

        const paramsAdminConfirmSignUp: AdminConfirmSignUpCommandInput = {
          UserPoolId: this.userPoolId,
          Username: user.userUsername as string,
        };

        await this.client.send(
          new AdminConfirmSignUpCommand(paramsAdminConfirmSignUp)
        );
      }

      return { user, code };
    } catch (error: any) {
      throw new Error(
        "UserRepositoryCognito, Error on confirmCode: " + error.message
      );
    }
  }

  async setUserPassword(email: string, newPassword: string): Promise<void> {
    try {
      const user = await this.getUserByEmail(email);

      if (!user) {
        return;
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
        "AuthRepositoryCognito, Error on setUserPassword: " + error.message
      );
    }
  }

  async finishSignUp(
    email: string,
    newUsername: string,
    password: string,
    newNickname?: string
  ): Promise<User | undefined> {
    try {
      console.log("INITIATING FINISH SIGN UP REPO");
      console.log("FINISH SIGN UP REPO", email, newUsername, newNickname);
      const user = await this.getUserByEmail(email);

      if (!user) return undefined;
      const emailUsername = user?.userUsername;

      console.log("PASSWORD REPO COGNITO: ", password);

      const params: AdminGetUserCommandInput = {
        UserPoolId: this.userPoolId,
        Username: emailUsername as string,
      };

      const command = new AdminGetUserCommand(params);
      const result = await this.client.send(command);
      console.log("FINISH SIGN UP RESULT FROM GET USER: ", result);
      if (!result.UserAttributes || !result.Username) {
        return undefined;
      }
      const userEntity = UserCognitoDTO.fromCognitoAttributes(
        result.Username,
        result.UserAttributes
      ).toEntity();

      userEntity.setUserNickname =
        newNickname || userEntity.userName.split(" ")[0];

      let userCogAttrs =
        UserCognitoDTO.fromEntity(userEntity).toCognitoAttributes();

      // remove email_verified attribute
      userCogAttrs = userCogAttrs.filter(
        (attr) => attr.Name !== "email_verified"
      );

      console.log("password", password);

      const paramsToRealSignUp: SignUpCommandInput = {
        ClientId: this.appClientId,
        Password: password,
        Username: newUsername,
        UserAttributes: userCogAttrs,
      };

      const commandToRealSignUp = new SignUpCommand(paramsToRealSignUp);
      console.log("COMMAND TO REAL SIGN UP: ", commandToRealSignUp);
      const resultRealSignUp = await this.client.send(commandToRealSignUp);

      console.log(
        "FINISH SIGN UP RESULT FROM REAL SIGN UP: ",
        resultRealSignUp
      );

      await this.client.send(
        new AdminConfirmSignUpCommand({
          UserPoolId: this.userPoolId,
          Username: newUsername,
        })
      );

      const paramsConfirmEmail: AdminUpdateUserAttributesCommandInput = {
        UserPoolId: this.userPoolId,
        Username: newUsername,
        UserAttributes: [
          {
            Name: "email_verified",
            Value: "true",
          },
        ],
      };

      const commandConfirmEmail = new AdminUpdateUserAttributesCommand(
        paramsConfirmEmail
      );
      await this.client.send(commandConfirmEmail);

      await this.client.send(
        new AdminDeleteUserCommand({
          UserPoolId: this.userPoolId,
          Username: emailUsername as string,
        })
      );

      console.log("CHEGOU NO FINAL DO FINISH SIGN UP REPO");

      const createdUser = await this.findUserByUsername(newUsername);

      if (!createdUser) return undefined;

      return createdUser;
    } catch (error: any) {
      if (error.name === "UsernameExistsException") {
        throw new DuplicatedItem("esse usuário");
      }

      throw new Error(
        "AuthRepositoryCognito, Error on finishSignUp: " + error.message
      );
    }
  }

  async signIn(
    identifier: string,
    password: string
  ): Promise<{
    accessToken: string;
    idToken: string;
    refreshToken: string;
  }> {
    try {
      console.log("IDENTIFIER: ", identifier);

      const regexEmail = /\S+@\S+\.\S+/;

      // Verifica se o identificador parece um email
      const isEmail = regexEmail.test(identifier); // Regex simples para validar email
      const user = isEmail
        ? await this.getUserByEmail(identifier)
        : await this.findUserByUsername(identifier); // Usa findUserByUsername para username

      console.log("USER vindo do get by user: ", user);

      if (!user) {
        throw new InvalidCredentialsError();
      }

      const username = user.userUsername; // Obtém o nome de usuário do objeto User

      const params: AdminInitiateAuthCommandInput = {
        UserPoolId: this.userPoolId,
        ClientId: this.appClientId,
        AuthFlow: "ADMIN_USER_PASSWORD_AUTH",
        AuthParameters: {
          USERNAME: username,
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

  // async deleteAccount(username: string) {
  //   try {
  //     console.log("USERNAME TO DELETE: ", username);
  //     const params: AdminDeleteUserCommandInput = {
  //       UserPoolId: this.userPoolId,
  //       Username: username,
  //     };

  //     const command = new AdminDeleteUserCommand(params);

  //     await this.client.send(command);

  //     console.log("DELETED USER AFTER SEND: ", username);
  //   } catch (error: any) {
  //     throw new Error(
  //       "AuthRepositoryCognito, Error on deleteAccount: " + error.message
  //     );
  //   }
  // }

  async updateProfile(username: string, nickname: string) {
    try {
      console.log("USERNAME TO UPDATE: ", username);
      console.log("NICKNAME TO UPDATE: ", nickname);
      const user = await this.findUserByUsername(username);

      console.log("USER TO UPDATE: ", user);

      const params: AdminUpdateUserAttributesCommandInput = {
        UserPoolId: this.userPoolId,
        Username: username,
        UserAttributes: [
          {
            Name: "nickname",
            Value: nickname,
          },
        ],
      };

      const command = new AdminUpdateUserAttributesCommand(params);

      await this.client.send(command);
    } catch (error: any) {
      throw new Error(
        "AuthRepositoryCognito, Error on updateProfile: " + error.message
      );
    }
  }

  async deleteAccount(username: string, password: string) {
    try {
      console.log("USERNAME TO DELETE: ", username);

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

  async changeUsername(
    email: string,
    username: string,
    newUsername: string,
    password: string
  ): Promise<ChangeUsernameReturnType | null> {
    // implementar a logica de pegar TODOS os attrs do user, salvar numa variavel e deletar o user e criar um novo com os mesmos attrs e o novo username e password

    try {
      const user = await this.getUserByEmail(email);

      if (!user) return null;

      const params: AdminGetUserCommandInput = {
        UserPoolId: this.userPoolId,
        Username: user.userUsername as string,
      };

      const command = new AdminGetUserCommand(params);
      const result = await this.client.send(command);

      if (!result.UserAttributes || !result.Username) {
        return null;
      }

      const userEntity = UserCognitoDTO.fromCognitoAttributes(
        result.Username,
        result.UserAttributes
      ).toEntity();

      let allAttributtesOfUser =
        UserCognitoDTO.fromEntity(userEntity).toCognitoAttributes();

      // remvoe email_verified attribute

      allAttributtesOfUser = allAttributtesOfUser.filter(
        (attr) => attr.Name !== "email_verified"
      );

      const paramsToRealSignUp: SignUpCommandInput = {
        ClientId: this.appClientId,
        Password: password,
        Username: newUsername,
        UserAttributes: allAttributtesOfUser,
      };

      const commandToRealSignUp = new SignUpCommand(paramsToRealSignUp);
      console.log("COMMAND TO REAL SIGN UP: ", commandToRealSignUp);
      const resultRealSignUp = await this.client.send(commandToRealSignUp);

      console.log(
        "FINISH SIGN UP RESULT FROM REAL SIGN UP: ",
        resultRealSignUp
      );

      await this.client.send(
        new AdminConfirmSignUpCommand({
          UserPoolId: this.userPoolId,
          Username: newUsername,
        })
      );

      const paramsConfirmEmail: AdminUpdateUserAttributesCommandInput = {
        UserPoolId: this.userPoolId,
        Username: newUsername,
        UserAttributes: [
          {
            Name: "email_verified",
            Value: "true",
          },
        ],
      };

      const commandConfirmEmail = new AdminUpdateUserAttributesCommand(
        paramsConfirmEmail
      );

      await this.client.send(commandConfirmEmail);

      await this.client.send(
        new AdminDeleteUserCommand({
          UserPoolId: this.userPoolId,
          Username: username,
        })
      );

      return {
        email: userEntity.userEmail,
        acceptedTerms: userEntity.userAcceptedTerms,
        name: userEntity.userName,
        nickname: userEntity.userNickname,
        role: userEntity.userrole,
      };
    } catch (error: any) {
      throw new Error(
        "AuthRepositoryCognito, Error on changeUsername: " + error.message
      );
    }
  }

  async findUserByUsername(username: string): Promise<User | undefined> {
    try {
      const params: AdminGetUserCommandInput = {
        UserPoolId: this.userPoolId,
        Username: username,
      };

      const command = new AdminGetUserCommand(params);
      const result = await this.client.send(command);

      if (!result || !result.UserAttributes || !result.Username) {
        return undefined;
      }

      const dto = UserCognitoDTO.fromCognitoAttributes(
        result.Username,
        result.UserAttributes
      );
      const userEntity = dto.toEntity();
      return userEntity;
    } catch (error: any) {
      if (error.name === "UserNotFoundException") {
        return undefined;
      }
      if (error.name === "ResourceNotFoundException") {
        return undefined;
      }
      throw new Error(
        "AuthRepositoryCognito, Error on findUserByUsername: " + error.message
      );
    }
  }

  async signUpOAuth(name: string, email: string): Promise<User> {
    try {
      const user = new User({
        name,
        email,
        username: email,
        nickname: name.split(" ")[0],
        emailVerified: false,
        acceptedTerms: true,
      });

      const dto = UserCognitoDTO.fromEntity(user);
      const userAttributes = dto.toCognitoAttributes();

      const params: SignUpCommandInput = {
        ClientId: this.appClientId,
        Password: "Teste123!",
        Username: email,
        UserAttributes: userAttributes,
      };

      const command = new SignUpCommand(params);
      await this.client.send(command);

      const paramsConfirmEmail: AdminUpdateUserAttributesCommandInput = {
        UserPoolId: this.userPoolId,
        Username: email,
        UserAttributes: [
          {
            Name: "email_verified",
            Value: "true",
          },
        ],
      };

      const commandConfirmEmail = new AdminUpdateUserAttributesCommand(
        paramsConfirmEmail
      );

      await this.client.send(commandConfirmEmail);

      const paramsAdminConfirmSignUp: AdminConfirmSignUpCommandInput = {
        UserPoolId: this.userPoolId,
        Username: email,
      };

      await this.client.send(
        new AdminConfirmSignUpCommand(paramsAdminConfirmSignUp)
      );

      return user;
    } catch (error: any) {
      throw new Error(
        "AuthRepositoryCognito, Error on signUpOAuth: " + error.message
      );
    }
  }

  async signInOAuth(email: string): Promise<{
    accessToken: string;
    idToken: string;
    refreshToken: string;
  }> {
    try {
      const user = await this.getUserByEmail(email);

      if (!user) {
        throw new InvalidCredentialsError();
      }

      const username = user.userUsername;

      const params: AdminInitiateAuthCommandInput = {
        UserPoolId: this.userPoolId,
        ClientId: this.appClientId,
        AuthFlow: "ADMIN_USER_PASSWORD_AUTH",
        AuthParameters: {
          USERNAME: username,
          PASSWORD: "Teste123!",
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
}
