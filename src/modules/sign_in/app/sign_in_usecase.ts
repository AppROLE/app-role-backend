import {
  EntityError,
  UserNotRegistered,
} from 'src/shared/helpers/errors/errors';
import { InvalidCredentialsError } from 'src/shared/helpers/errors/errors';
import { Validations } from 'src/shared/helpers/utils/validations';
import { IAuthRepository } from 'src/shared/domain/repositories/auth_repository_interface';
import { Repository } from 'src/shared/infra/database/repositories/repository';
import { User } from 'src/shared/domain/entities/user';
import { ROLE_TYPE } from 'src/shared/domain/enums/role_type_enum';
import { USER_STATUS } from 'src/shared/domain/enums/user_status';

interface SignInResponse {
  userId: string;
  email: string;
  username: string;
  name: string;
  role: ROLE_TYPE;
  userStatus: USER_STATUS;
  enabled: boolean;
  emailVerified: boolean;
  accessToken?: string;
  idToken?: string;
  refreshToken?: string;
}

export class SignInUseCase {
  repository: Repository;
  private auth_repo?: IAuthRepository;

  constructor() {
    this.repository = new Repository({
      auth_repo: true,
    });
  }

  async connect() {
    await this.repository.connectRepository();
    this.auth_repo = this.repository.auth_repo;

    if (!this.auth_repo)
      throw new Error('Expected to have an instance of the auth repository');
  }

  async execute(email: string, password: string): Promise<SignInResponse> {
    if (!Validations.validateEmail(email)) {
      throw new EntityError('email');
    }

    if (!Validations.validatePassword(password)) {
      throw new EntityError('password');
    }

    const user = await this.auth_repo?.getUserByEmail(email);

    if (!user) {
      throw new UserNotRegistered();
    }

    if (!user.emailVerified) {
      return {
        userId: user.userId,
        email: user.email,
        username: user.username,
        name: user.name,
        role: user.role,
        userStatus: user.userStatus,
        enabled: user.enabled,
        emailVerified: user.emailVerified,
      };
    }

    const result = await this.auth_repo?.signIn(email, password);

    if (!result) {
      throw new InvalidCredentialsError('Tokens não encontrados');
    }

    return {
      userId: user.userId,
      email: user.email,
      username: user.username,
      name: user.name,
      role: user.role,
      userStatus: user.userStatus,
      enabled: user.enabled,
      emailVerified: user.emailVerified,
      accessToken: result.accessToken,
      idToken: result.idToken,
      refreshToken: result.refreshToken,
    };
  }
}
