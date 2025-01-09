import { IAuthRepository } from 'src/shared/domain/repositories/auth_repository_interface';
import { EntityError } from 'src/shared/helpers/errors/errors';
import { NoItemsFound } from 'src/shared/helpers/errors/errors';
import { Validations } from 'src/shared/helpers/utils/validations';
import { Repository } from 'src/shared/infra/database/repositories/repository';

export class ResendCodeUseCase {
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

  async execute(email: string) {
    if (!Validations.validateEmail(email)) {
      throw new EntityError('email');
    }

    const user = await this.auth_repo!.getUserByEmail(email);

    if (!user) {
      throw new NoItemsFound('email');
    }
    await this.auth_repo!.resendCode(email);
  }
}
