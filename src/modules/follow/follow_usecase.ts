import { Profile } from 'src/shared/domain/entities/profile';
import { FOLLOW_STATUS } from 'src/shared/domain/enums/follow_status';
import { IProfileRepository } from 'src/shared/domain/repositories/profile_repository_interface';
import { DuplicatedItem, NoItemsFound } from 'src/shared/helpers/errors/errors';
import { Repository } from 'src/shared/infra/database/repositories/repository';

export class FollowUsecase {
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

  async execute(myUserId: string, userId: string): Promise<void> {
    const myProfile = await this.profile_repo!.getByUserId(myUserId);
    if (!myProfile)
      throw new NoItemsFound('Perfil do usuário atual não encontrado');

    const otherProfile = await this.profile_repo!.getByUserId(userId);
    if (!otherProfile)
      throw new NoItemsFound('Perfil do outro usuário não encontrado');

    const followStatus = this.getFollowStatus(myProfile, otherProfile);

    if (followStatus === FOLLOW_STATUS.UNFOLLOWED) {
      await this.profile_repo!.followProfile(myUserId, userId);
    }

    throw new DuplicatedItem('Você já segue esse perfil');
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
