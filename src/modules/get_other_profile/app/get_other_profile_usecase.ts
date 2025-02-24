import { Profile } from 'src/shared/domain/entities/profile';
import { Review } from 'src/shared/domain/entities/review';
import { FOLLOW_STATUS } from 'src/shared/domain/enums/follow_status';
import { IProfileRepository } from 'src/shared/domain/repositories/profile_repository_interface';
import { IReviewRepository } from 'src/shared/domain/repositories/review_repository_interface';
import { NoItemsFound } from 'src/shared/helpers/errors/errors';
import { EventCardReturn } from 'src/shared/helpers/types/event_card_return';
import { PaginationReturn } from 'src/shared/helpers/types/event_pagination';
import { OtherProfileInfo } from 'src/shared/helpers/types/other_profile_info';
import { Repository } from 'src/shared/infra/database/repositories/repository';

export class GetOtherProfileUseCase {
  repository: Repository;
  private profile_repo?: IProfileRepository;
  private review_repo?: IReviewRepository;

  constructor() {
    this.repository = new Repository({
      profile_repo: true,
      review_repo: true,
    });
  }

  async connect() {
    await this.repository.connectRepository();
    this.profile_repo = this.repository.profile_repo;
    this.review_repo = this.repository.review_repo;

    if (!this.profile_repo)
      throw new Error('Expected to have an instance of the profile repository');

    if (!this.review_repo)
      throw new Error('Expected to have an instance of the review repository');
  }

  async execute(
    page: number,
    myUserId: string,
    userId: string
  ): Promise<[OtherProfileInfo, PaginationReturn<EventCardReturn>, Review[]?]> {
    const myProfile = await this.profile_repo!.getByUserId(myUserId);
    if (!myProfile) throw new NoItemsFound('Perfil do usuário não encontrado');

    const otherProfile = await this.profile_repo!.getByUserId(userId);
    if (!otherProfile)
      throw new NoItemsFound('Perfil do outro usuário não encontrado');

    const followStatus = this.getFollowStatus(myProfile, otherProfile);

    const otherProfileInfo: OtherProfileInfo = {
      userId: otherProfile.userId,
      name: otherProfile.name,
      nickname: otherProfile.nickname,
      username: otherProfile.username,
      biography: otherProfile.biography,
      linkInstagram: otherProfile.linkInstagram,
      linkTiktok: otherProfile.linkTiktok,
      backgroundPhoto: otherProfile.backgroundPhoto,
      profilePhoto: otherProfile.profilePhoto,
      followersLength: otherProfile.followers.length,
      followingLength: otherProfile.following.length,
      followStatus,
      isPrivate: otherProfile.isPrivate,
    };

    if (followStatus === FOLLOW_STATUS.FRIENDS) {
      const confirmedEvents =
        await this.profile_repo!.getConfirmedPresencesEventCardsForProfile(
          userId,
          page
        );
      const reviews = await this.review_repo!.getReviewsByUserId(userId);
      return [otherProfileInfo, confirmedEvents, reviews];
    }

    if (!otherProfile.isPrivate) {
      const confirmedEvents =
        await this.profile_repo!.getConfirmedPresencesEventCardsForProfile(
          userId,
          page
        );
      return [otherProfileInfo, confirmedEvents];
    }

    return [
      otherProfileInfo,
      {
        items: [],
        totalPages: 0,
        totalCount: 0,
        prevPage: null,
        nextPage: null,
      },
    ];
  }

  private getFollowStatus(
    myProfile: Profile,
    otherProfile: Profile
  ): FOLLOW_STATUS {
    if (
      myProfile.following.includes(otherProfile.userId) &&
      otherProfile.followers.includes(myProfile.userId)
    ) {
      return FOLLOW_STATUS.FRIENDS;
    }
    if (myProfile.following.includes(otherProfile.userId)) {
      return FOLLOW_STATUS.FOLLOWING;
    }
    return FOLLOW_STATUS.UNFOLLOWED;
  }
}
