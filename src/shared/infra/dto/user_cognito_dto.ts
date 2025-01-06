import { User } from "src/shared/domain/entities/user";

const TO_COGNITO_PARAMS = {
  email: "email",
  name: "name",
  nickname: "nickname",
  roleType: "custom:roleType",
  acceptedTerms: "custom:acceptedTerms",
  confirmationCode: "custom:confirmationCode",
  phoneNumber: "phoneNumber",
  emailVerified: "email_verified",
};

const FROM_COGNITO_PARAMS = {
  userId: "sub",
  email: "email",
  name: "name",
  nickname: "nickname",
  roleType: "custom:roleType",
  acceptedTerms: "custom:acceptedTerms",
  confirmationCode: "custom:confirmationCode",
  phoneNumber: "phoneNumber",
  emailVerified: "email_verified",
};

export class UserCognitoDTO {
  userId?: string;
  username: string;
  email: string;
  name: string;
  nickname: string;
  roleType: string;
  acceptedTerms: boolean;
  confirmationCode: string;
  phoneNumber: string;
  emailVerified: boolean;

  constructor(
    username: string,
    email: string,
    name: string,
    nickname: string,
    roleType: string,
    acceptedTerms: boolean,
    confirmationCode: string,
    phoneNumber: string,
    emailVerified: boolean,
    userId?: string
  ) {
    this.userId = userId;
    this.username = username;
    this.email = email;
    this.name = name;
    this.emailVerified = emailVerified;
    this.nickname = nickname;
    this.roleType = roleType;
    this.acceptedTerms = acceptedTerms;
    this.confirmationCode = confirmationCode;
    this.phoneNumber = phoneNumber;
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
          Value: typeof value === "boolean" ? value.toString() : value,
        });
      }
    }

    return attributes;
  }

  static fromCognitoAttributes(
    username: string,
    attrs: { [key: string]: any } | undefined
  ): UserCognitoDTO {
    const userAttrs: { [key: string]: any } = {};

    if (attrs) {
      console.log("COGNITO DTO - attrs", attrs);
      for (const key in FROM_COGNITO_PARAMS) {
        const typedKey = key as keyof typeof FROM_COGNITO_PARAMS;
        console.log("COGNITO DTO - typedKey", typedKey);
        const cognitoKey = FROM_COGNITO_PARAMS[typedKey];
        console.log("COGNITO DTO - cognitoKey", cognitoKey);
        const attribute = attrs.find((attr: any) => attr.Name === cognitoKey);
        console.log("COGNITO DTO - attribute", attribute);

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
      username,
      userAttrs.email ?? "",
      userAttrs.name ?? "",
      userAttrs.nickname ?? "",
      userAttrs.roleType ?? "COMMON",
      userAttrs.acceptedTerms ?? false,
      userAttrs.confirmationCode ?? "",
      userAttrs.phoneNumber ?? "",
      userAttrs.emailVerified ?? false,
      userAttrs.userId
    );
  }

  toEntity() {
    return new User({
      user_id: this.userId,
      name: this.name,
      username: this.username,
      nickname: this.nickname,
      email: this.email,
      acceptedTerms: this.acceptedTerms,
      phoneNumber: this.phoneNumber,
      confirmationCode: this.confirmationCode,
      emailVerified: this.emailVerified,
    });
  }

  static fromEntity(user: User) {
    return new UserCognitoDTO(
      user.userUsername,
      user.userEmail,
      user.userName,
      user.userNickname as string,
      user.userRoleType as string,
      user.userAcceptedTerms,
      user.userConfirmationCode as string,
      user.userPhoneNumber as string,
      user.userEmailVerified,
      user.userId as string
    );
  }
}
