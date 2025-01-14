import { Profile } from 'src/shared/domain/entities/profile';
import { IProfileRepository } from 'src/shared/domain/repositories/profile_repository_interface';
import { NoItemsFound } from 'src/shared/helpers/errors/errors';
import { PaginationReturn } from 'src/shared/helpers/types/event_pagination';
import { ProfileCardReturn } from 'src/shared/helpers/types/profile_card_return';
import { Repository } from 'src/shared/infra/database/repositories/repository';

export class GetMyFollowersUsecase {
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
    userId: string,
    page: number
  ): Promise<PaginationReturn<ProfileCardReturn>> {
    const profile = await this.profile_repo!.getByUserId(userId);
    if (!profile) throw new NoItemsFound('Perfil do usuário não encontrado');

    const paginatedProfiles = await this.profile_repo!.getAllProfilesPagination(
      page,
      profile.followers
    );

    const transformedItems = paginatedProfiles.items.map((profile) => ({
      userId: profile.userId,
      nickname: profile.nickname,
      username: profile.username,
      profilePhoto: profile.profilePhoto,
    }));

    return {
      ...paginatedProfiles,
      items: transformedItems,
    };
  }
}
