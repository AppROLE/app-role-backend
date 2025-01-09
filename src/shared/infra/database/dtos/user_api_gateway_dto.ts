import { ROLE_TYPE } from 'src/shared/domain/enums/role_type_enum';
import { Validations } from 'src/shared/helpers/utils/validations';

export class UserAPIGatewayDTO {
  userId: string;
  username?: string;
  email: string;
  name: string;
  role: ROLE_TYPE;

  constructor(
    userId: string,
    email: string,
    name: string,
    role: ROLE_TYPE,
    username?: string
  ) {
    this.userId = userId;
    this.email = email;
    this.name = name;
    this.username = username;
    this.role = role;
  }

  static fromAPIGateway(data: Record<string, any>): UserAPIGatewayDTO {
    return new UserAPIGatewayDTO(
      data['sub'],
      data['username'],
      data['email'],
      data['name'],
      data['custom:role']
    );
  }
}
