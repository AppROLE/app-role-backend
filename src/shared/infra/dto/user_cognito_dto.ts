import { ROLE_TYPE } from "src/shared/domain/enums/role_type_enum";
import { USER_STATUS } from "src/shared/domain/enums/user_status";

const TO_COGNITO_PARAMS = {
  email: "email",
  username: "username",
  name: "name",
  role: "custom:role",
};

const FROM_COGNITO_PARAMS = {
  userId: "sub",
  username: "username",
  email: "email",
  name: "name",
  role: "custom:role",
  emailVerified: "email_verified",
};

export class UserCognitoDTO {
  email: string;
  username: string;
  name: string;
  role: ROLE_TYPE;
  userStatus: USER_STATUS;
  enabled: boolean;
  emailVerified?: boolean;
  userId?: string;

  constructor(
    email: string,
    username: string,
    name: string,
    role: ROLE_TYPE,
    userStatus: USER_STATUS,
    enabled: boolean,
    emailVerified?: boolean,
    userId?: string
  ) {
    this.userId = userId;
    this.email = email;
    this.name = name;
    this.enabled = enabled;
    this.userStatus = userStatus;
    this.emailVerified = emailVerified;
    this.username = username;
    this.role = role;
  }

  toCognitoAttributes() {
    const attributes: { Name: string; Value: string }[] = [];

    for (const key in TO_COGNITO_PARAMS) {
      const typedKey = key as keyof typeof TO_COGNITO_PARAMS;
      const cognitoKey = TO_COGNITO_PARAMS[typedKey];
      const value = this[typedKey];

      if (value) {
        attributes.push({
          Name: cognitoKey,
          Value: value,
        });
      }
    }

    return attributes;
  }

  static fromCognitoAttributes(
    attrs: { [key: string]: any } | undefined
  ): UserCognitoDTO {
    const userAttrs: { [key: string]: any } = {};

    if (attrs) {
      for (const key in FROM_COGNITO_PARAMS) {
        const typedKey = key as keyof typeof FROM_COGNITO_PARAMS;
        const cognitoKey = FROM_COGNITO_PARAMS[typedKey];
        const attribute = attrs.find((attr: any) => attr.Name === cognitoKey);

        if (attribute?.Value === "true") {
          userAttrs[typedKey] = true;
        } else if (attribute?.Value === "false") {
          userAttrs[typedKey] = false;
        } else {
          userAttrs[typedKey] = attribute?.Value || null;
        }
      }
    }

    return new UserCognitoDTO(
      userAttrs.email ?? "",
      userAttrs.name ?? "",
      userAttrs.username ?? "",
      userAttrs.role ?? "COMMON",
      userAttrs.emailVerified ?? false,
      userAttrs.userId
    );
  }
}
