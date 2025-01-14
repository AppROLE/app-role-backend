import { Profile } from 'src/shared/domain/entities/profile';
import { IProfileRepository } from 'src/shared/domain/repositories/profile_repository_interface';
import { NoItemsFound } from 'src/shared/helpers/errors/errors';
import { PaginationReturn } from 'src/shared/helpers/types/event_pagination';
import { ProfileCardReturn } from 'src/shared/helpers/types/profile_card_return';
import { Repository } from 'src/shared/infra/database/repositories/repository';

export class GetOtherFollowingUsecase {
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
    userId: string,
    page: number
  ): Promise<PaginationReturn<ProfileCardReturn>> {
    const myProfile = await this.profile_repo!.getByUserId(myUserId);
    if (!myProfile)
      throw new NoItemsFound('Perfil do usuário atual não encontrado');

    const otherProfile = await this.profile_repo!.getByUserId(userId);
    if (!otherProfile)
      throw new NoItemsFound('Perfil do outro usuário não encontrado');

    const areWeFriends =
      myProfile.following.includes(otherProfile.userId) &&
      otherProfile.followers.includes(myProfile.userId);

    if (!areWeFriends)
      return {
        items: [],
        totalPages: 0,
        totalCount: 0,
        prevPage: null,
        nextPage: null,
      };

    const paginatedProfiles = await this.profile_repo!.getAllProfilesPagination(
      page,
      otherProfile.following
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
