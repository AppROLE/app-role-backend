export class UserAPIGatewayDTO {
  userId: string;
  username?: string;
  email: string;
  name: string;

  constructor(
    userId: string,
    email: string,
    name: string,
    username?: string,
  ) {
    this.userId = userId;
    this.email = email;
    this.name = name;
    this.username = username;
  }

  static fromAPIGateway(data: Record<string, any>): UserAPIGatewayDTO {
    return new UserAPIGatewayDTO(
      data["sub"],
      data["username"],
      data["email"],
      data["name"]
    );
  }

  getParsedData() {
    return {
      userId: this.userId,
      username: this.username,
      email: this.email,
      name: this.name,
    };
  }
}
