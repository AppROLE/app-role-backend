import { IAuthRepository } from 'src/shared/domain/repositories/auth_repository_interface';
import { IEmailRepository } from 'src/shared/domain/repositories/email_interface';
import { IProfileRepository } from 'src/shared/domain/repositories/profile_repository_interface';
import { NoItemsFound } from 'src/shared/helpers/errors/errors';
import { accountDeletionEmailBody } from 'src/shared/helpers/utils/delete_user_email_body';
import { Repository } from 'src/shared/infra/database/repositories/repository';

export class DeleteUserUsecase {
  repository: Repository;
  private auth_repo?: IAuthRepository;
  private profile_repo?: IProfileRepository;
  private email_repo?: IEmailRepository;

  constructor() {
    this.repository = new Repository({
      auth_repo: true,
      profile_repo: true,
      email_repo: true,
    });
  }

  async connect() {
    await this.repository.connectRepository();
    this.auth_repo = this.repository.auth_repo;
    this.profile_repo = this.repository.profile_repo;
    this.email_repo = this.repository.email_repo;

    if (!this.auth_repo)
      throw new Error('Expected to have an instance of the auth repository');

    if (!this.profile_repo)
      throw new Error('Expected to have an instance of the profile repository');

    if (!this.email_repo)
      throw new Error('Expected to have an instance of the email repository');
  }

  async execute(userId: string) {
    const profile = await this.profile_repo!.getByUserId(userId);
    if (!profile) throw new NoItemsFound('Perfil não encontrado');

    await this.profile_repo!.deleteProfile(userId);

    await this.auth_repo!.deleteUser(profile.email);

    await this.email_repo!.sendEmail({
      to: profile.email,
      subject: 'Conta Deletada',
      body: accountDeletionEmailBody(profile.name),
    });
  }
}
