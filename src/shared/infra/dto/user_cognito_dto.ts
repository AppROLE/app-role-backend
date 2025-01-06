const TO_COGNITO_PARAMS = {
  email: "email",
  name: "name",
  role: "custom:role",
};

const FROM_COGNITO_PARAMS = {
  userId: "sub",
  email: "email",
  name: "name",
  role: "custom:role",
  emailVerified: "email_verified",
};

export class UserCognitoDTO {
  userId?: string;
  email: string;
  name: string;
  role: string;
  emailVerified: boolean;

  constructor(
    email: string,
    name: string,
    role: string,
    emailVerified: boolean,
    userId?: string
  ) {
    this.userId = userId;
    this.email = email;
    this.name = name;
    this.emailVerified = emailVerified;
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
      userAttrs.role ?? "COMMON",
      userAttrs.emailVerified ?? false,
      userAttrs.userId
    );
  }
}
