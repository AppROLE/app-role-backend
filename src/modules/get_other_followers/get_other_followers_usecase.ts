import { Profile } from "src/shared/domain/entities/profile";
import { IProfileRepository } from "src/shared/domain/repositories/profile_repository_interface";
import { NoItemsFound } from "src/shared/helpers/errors/errors";
import { Repository } from "src/shared/infra/database/repositories/repository";

export class GetOtherFollowersUsecase {
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

  async execute(
    myUserId: string,
    userId: string): Promise<Profile[]> {
    // Buscar o perfil do usuário atual
    const myProfile = await this.profile_repo!.getByUserId(myUserId);
    if (!myProfile)
      throw new NoItemsFound('Perfil do usuário atual não encontrado');

    // Buscar o perfil do outro usuário
    const otherProfile = await this.profile_repo!.getByUserId(userId);
    if (!otherProfile)
      throw new NoItemsFound('Perfil do outro usuário não encontrado');

    const areWeFriends =
      myProfile.following.includes(otherProfile.userId) &&
      otherProfile.followers.includes(myProfile.userId);

    if(!areWeFriends) return [];

    return await this.profile_repo!.getProfilesByIds(otherProfile.followers);
  }
}