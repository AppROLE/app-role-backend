import { IAuthRepository } from 'src/shared/domain/repositories/auth_repository_interface';
import { IProfileRepository } from 'src/shared/domain/repositories/profile_repository_interface';
import { NoItemsFound } from 'src/shared/helpers/errors/errors';
import { Repository } from 'src/shared/infra/database/repositories/repository';

export class DeleteProfileUsecase {
  repository: Repository;
  private auth_repo?: IAuthRepository;
  private profile_repo?: IProfileRepository;

  constructor() {
    this.repository = new Repository({
      auth_repo: true,
      profile_repo: true,
    });
  }

  async connect() {
    await this.repository.connectRepository();
    this.auth_repo = this.repository.auth_repo;
    this.profile_repo = this.repository.profile_repo;

    if (!this.auth_repo)
      throw new Error('Expected to have an instance of the auth repository');

    if (!this.profile_repo)
      throw new Error('Expected to have an instance of the profile repository');
  }

  async execute(userId: string) {
    const profile = await this.profile_repo!.getByUserId(userId);
    if (!profile) throw new NoItemsFound('Perfil não encontrado');

    await this.profile_repo!.deleteProfile(userId);

    await this.auth_repo!.deleteCustomAttribute(profile.email, [
      'custom:usename',
    ]);

    await this.auth_repo!.disableUser(profile.email);
  }
}
