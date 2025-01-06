export class UserAPIGatewayDTO {
  userId: string;
  username: string;
  email: string;
  nickname: string;

  constructor(
    userId: string,
    username: string,
    email: string,
    nickname: string
  ) {
    this.userId = userId;
    this.username = username;
    this.email = email;
    this.nickname = nickname;
  }

  static fromAPIGateway(data: Record<string, any>): UserAPIGatewayDTO {
    console.log("data FROM API GATEWAY ", data);
    return new UserAPIGatewayDTO(
      data["sub"],
      data["cognito:username"],
      data["email"],
      data["nickname"] || ""
    );
  }

  getParsedData() {
    return {
      userId: this.userId,
      username: this.username,
      email: this.email,
      nickname: this.nickname,
    };
  }
}
