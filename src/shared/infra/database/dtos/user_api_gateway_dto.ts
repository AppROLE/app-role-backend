import { ROLE_TYPE } from 'src/shared/domain/enums/role_type_enum';

interface UserAPIGatewayProps {
  userId: string;
  username?: string;
  email: string;
  name: string;
  role: ROLE_TYPE;
}

export class UserAPIGatewayDTO {
  userId: string;
  username?: string;
  email: string;
  name: string;
  role: ROLE_TYPE;

  constructor(props: UserAPIGatewayProps) {
    this.userId = props.userId;
    this.username = props.username;
    this.email = props.email;
    this.name = props.name;
    this.role = props.role;
  }

  static fromAPIGateway(data: Record<string, any>): UserAPIGatewayDTO {
    return new UserAPIGatewayDTO({
      userId: data.userId,
      username: data.username,
      email: data.email,
      name: data.name,
      role: data.role,
    });
  }
}
