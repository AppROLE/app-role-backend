import { Profile } from "src/shared/domain/entities/profile";
import { IProfileRepository } from "src/shared/domain/repositories/profile_repository_interface";
import { NoItemsFound } from "src/shared/helpers/errors/errors";
import { Repository } from "src/shared/infra/database/repositories/repository";

export class GetMyFollowingUseCase {
  repository: Repository;
  private profile_repo?: IProfileRepository;

  constructor() {
    this.repository = new Repository({
      profile_repo: true,
    });
  }

  async connect() {
    await this.repository.connectRepository();
    this.profile_repo = this.repository.profile_repo;

    if (!this.profile_repo)
      throw new Error('Expected to have an instance of the profile repository');
  }

  async execute(userId: string): Promise<Profile[]> {
    const profile = await this.profile_repo!.getByUserId(userId);
    if (!profile) throw new NoItemsFound('Perfil do usuário não encontrado');

    return await this.profile_repo!.getProfilesByIds(profile.following);
  }
}