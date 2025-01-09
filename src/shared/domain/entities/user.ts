import { EntityError } from '../../helpers/errors/errors';
import { ROLE_TYPE } from '../enums/role_type_enum';
import { Validations } from '../../helpers/utils/validations';
import { USER_STATUS } from '../enums/user_status';

interface UserProps {
  userId: string;
  email: string;
  username: string;
  name: string;
  role: ROLE_TYPE;
  userStatus: USER_STATUS;
  enabled: boolean;
  emailVerified: boolean;
}

export class User {
  userId: string;
  email: string;
  username: string;
  name: string;
  role: ROLE_TYPE;
  userStatus: USER_STATUS;
  enabled: boolean;
  emailVerified: boolean;

  constructor(props: UserProps) {
    if (!Validations.validateUserId(props.userId)) {
      throw new EntityError('userId');
    }
    this.userId = props.userId;

    if (!Validations.validateEmail(props.email)) {
      throw new EntityError('email');
    }
    this.email = props.email;

    if (!Validations.validateUsername(props.username)) {
      throw new EntityError('username');
    }
    this.username = props.username;

    if (!Validations.validateName(props.name)) {
      throw new EntityError('name');
    }
    this.name = props.name;

    if (!Validations.validateRole(props.role)) {
      throw new EntityError('role');
    }
    this.role = props.role;

    if (
      props.userStatus &&
      !Object.values(USER_STATUS).includes(props.userStatus)
    ) {
      throw new EntityError('userStatus');
    }
    this.userStatus = props.userStatus;

    if (typeof props.enabled !== 'boolean') {
      throw new EntityError('enabled');
    }
    this.enabled = props.enabled;

    if (typeof props.emailVerified !== 'boolean') {
      throw new EntityError('emailVerified');
    }
    this.emailVerified = props.emailVerified;
  }
}
