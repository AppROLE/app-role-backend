import { Profile } from 'src/shared/domain/entities/profile';
import { STATUS } from 'src/shared/domain/enums/status_enum';
import { IEventRepository } from 'src/shared/domain/repositories/event_repository_interface';
import { IInstituteRepository } from 'src/shared/domain/repositories/institute_repository_interface';
import { IPresenceRepository } from 'src/shared/domain/repositories/presence_repository_interface';
import { IProfileRepository } from 'src/shared/domain/repositories/profile_repository_interface';
import { NoItemsFound } from 'src/shared/helpers/errors/errors';
import { EventCardReturn } from 'src/shared/helpers/types/event_card_return';
import { PaginationReturn } from 'src/shared/helpers/types/event_pagination';
import { Repository } from 'src/shared/infra/database/repositories/repository';

export interface ConfirmedEventsResponse {
  eventId: string;
  eventName: string;
  instituteName: string;
  neighborhood: string;
  eventStatus: STATUS;
  eventPhoto: string;
  eventDate: number;
}

export class GetOtherProfileUseCase {
  repository: Repository;
  private profile_repo?: IProfileRepository;
  private event_repo?: IEventRepository;
  private institute_repo?: IInstituteRepository;
  private presence_repo?: IPresenceRepository;

  constructor() {
    this.repository = new Repository({
      profile_repo: true,
      event_repo: true,
      institute_repo: true,
      presence_repo: true,
    });
  }

  async connect() {
    await this.repository.connectRepository();
    this.profile_repo = this.repository.profile_repo;
    this.event_repo = this.repository.event_repo;
    this.institute_repo = this.repository.institute_repo;
    this.presence_repo = this.repository.presence_repo;

    if (!this.profile_repo)
      throw new Error('Expected to have an instance of the profile repository');

    if (!this.event_repo)
      throw new Error('Expected to have an instance of the event repository');

    if (!this.institute_repo)
      throw new Error(
        'Expected to have an instance of the institute repository'
      );

    if (!this.presence_repo)
      throw new Error(
        'Expected to have an instance of the presence repository'
      );
  }

  async execute(
    page: number,
    myUserId: string,
    userId: string
  ): Promise<[Profile, PaginationReturn<EventCardReturn> | null]> {
    const myProfile = await this.profile_repo!.getByUserId(myUserId);
    if (!myProfile) throw new NoItemsFound('Perfil do usuário não encontrado');

    const otherProfile = await this.profile_repo!.getByUserId(userId);
    if (!otherProfile)
      throw new NoItemsFound('Perfil do outro usuário não encontrado');

    const areWeFriends =
      myProfile.following.includes(otherProfile.userId) &&
      otherProfile.followers.includes(myProfile.userId);

    if (!areWeFriends) return [otherProfile, null];

    const confirmedEvents =
      await this.profile_repo!.getConfirmedPresencesEventCardsForProfile(
        userId,
        page
      );

    return [otherProfile, confirmedEvents];
  }
}
