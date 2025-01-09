import { EntityError } from 'src/shared/helpers/errors/errors';
import { InvalidCredentialsError } from 'src/shared/helpers/errors/errors';
import { Validations } from 'src/shared/helpers/utils/validations';
import { IAuthRepository } from 'src/shared/domain/repositories/auth_repository_interface';
import { Repository } from 'src/shared/infra/database/repositories/repository';

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

  async execute(
    email: string,
    password: string
  ): Promise<{ accessToken: string; idToken: string; refreshToken: string }> {
    if (!Validations.validateEmail(email)) {
      throw new EntityError('email');
    }

    if (!Validations.validatePassword(password)) {
      throw new EntityError('password');
    }

    const result = await this.auth_repo?.signIn(email, password);

    if (!result) {
      throw new InvalidCredentialsError();
    }

    return result;
  }
}
