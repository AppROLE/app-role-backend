import { User } from "../../domain/entities/user";
import { roleToEnum, ROLE_TYPE } from "../../domain/enums/role_type_enum";
import { userStatusToEnum, USER_STATUS } from "../../domain/enums/user_status";

const TO_COGNITO_PARAMS = {
  email: "email",
  name: "name",
  username: "custom:username",
  role: "custom:role",
};

type CognitoAttribute = {
  Name: string;
  Value: string;
};

interface UserCognitoProps {
  userId: string;
  email: string;
  username: string;
  name: string;
  role: ROLE_TYPE;
  userStatus: USER_STATUS;
  enabled: boolean;
  emailVerified: boolean;
}

export class UserCognitoDTO {
  email: string;
  username: string;
  name: string;
  role: ROLE_TYPE;
  userStatus: USER_STATUS;
  enabled: boolean;
  emailVerified?: boolean;
  userId: string;

  constructor(props: UserCognitoProps) {
    this.userId = props.userId;
    this.email = props.email;
    this.name = props.name;
    this.enabled = props.enabled;
    this.userStatus = props.userStatus;
    this.emailVerified = props.emailVerified;
    this.username = props.username;
    this.role = props.role;
  }

  static fromEntity(user: User) {
    return new UserCognitoDTO({
      email: user.email,
      username: user.username,
      name: user.name,
      role: user.role,
      userStatus: user.userStatus,
      enabled: user.enabled,
      userId: user.userId,
      emailVerified: user.emailVerified,
    });
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

  static fromCognito(data: Record<string, any>): UserCognitoDTO {
    const userAttributes: CognitoAttribute[] = data.UserAttributes || [];

    const userData: Record<string, any> = {};
    for (const att of userAttributes) {
      userData[att.Name] = att.Value;
    }

    userData["enabled"] = data["Enabled"];
    userData["status"] = data["UserStatus"] ?? "CONFIRMED";

    console.log(userData["custom:role"]);

    return new UserCognitoDTO({
      userId: userData["sub"],
      email: userData["email"],
      username: userData["custom:username"],
      name: userData["name"],
      role: roleToEnum(userData["custom:role"]) as ROLE_TYPE,
      userStatus: userStatusToEnum(userData["status"]) as USER_STATUS,
      enabled: userData["enabled"],
      emailVerified: userData["email_verified"] === "true",
    });
  }
}
