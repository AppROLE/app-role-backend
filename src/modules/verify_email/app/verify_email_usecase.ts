import { IAuthRepository } from 'src/shared/domain/repositories/auth_repository_interface';
import { EntityError } from 'src/shared/helpers/errors/errors';
import { NoItemsFound } from 'src/shared/helpers/errors/errors';
import { Validations } from 'src/shared/helpers/utils/validations';
import { Repository } from 'src/shared/infra/database/repositories/repository';

export class VerifyEmailUsecase {
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
      throw new Error(
        'Expected to have an instance of the institute repository'
      );
  }

  async execute(email: string, code: string) {
    if (!Validations.validateEmail(email)) {
      throw new EntityError('email');
    }

    if (!code || code.length < 4 || code.length > 20) {
      throw new EntityError('code');
    }

    const result = await this.auth_repo!.confirmCode(email, code);

    if (!result) {
      throw new NoItemsFound('código');
    }

    return { message: 'Código validado com sucesso!' };
  }

  async getUser(email: string) {
    if (!Validations.validateEmail(email)) {
      throw new EntityError('email');
    }

    const result = await this.auth_repo!.getUserByEmail(email);

    if (!result) {
      throw new NoItemsFound('usuário');
    }

    return result;
  }
}
