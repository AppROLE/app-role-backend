import { Address } from 'src/shared/domain/entities/address';
import { Profile } from 'src/shared/domain/entities/profile';
import { IEventRepository } from 'src/shared/domain/repositories/event_repository_interface';
import { IPresenceRepository } from 'src/shared/domain/repositories/presence_repository_interface';
import { IProfileRepository } from 'src/shared/domain/repositories/profile_repository_interface';
import { NoItemsFound } from 'src/shared/helpers/errors/errors';
import { Repository } from 'src/shared/infra/database/repositories/repository';

export type PresencesReturn = {
  eventId: string;
  name: string;
  address: Address;
  eventDate: number;
  eventPhoto: string;
  presenceId: string;
};

export class GetMyProfileUseCase {
  repository: Repository;
  private profile_repo?: IProfileRepository;
  private presence_repo?: IPresenceRepository;
  private event_repo?: IEventRepository;

  constructor() {
    this.repository = new Repository({
      profile_repo: true,
      presence_repo: true,
      event_repo: true,
    });
  }

  async connect() {
    await this.repository.connectRepository();
    this.profile_repo = this.repository.profile_repo;
    this.presence_repo = this.repository.presence_repo;
    this.event_repo = this.repository.event_repo;

    if (!this.profile_repo)
      throw new Error('Expected to have an instance of the profile repository');

    if (!this.presence_repo)
      throw new Error(
        'Expected to have an instance of the presence repository'
      );

    if (!this.event_repo)
      throw new Error('Expected to have an instance of the event repository');
  }

  async execute(userId: string): Promise<[Profile, PresencesReturn[]]> {
    const profile = await this.profile_repo!.getByUserId(userId);
    if (!profile) throw new NoItemsFound('Perfil do usuário não encontrado');

    const presences = await this.presence_repo!.getPresencesByUser(userId);

    const eventPresencesIds = presences.map((presence) => presence.eventId);

    const events = await this.event_repo!.getEventsByIds(eventPresencesIds);

    const presencesReturn = events.map((event) => ({
      eventId: event.eventId,
      name: event.name,
      address: event.address,
      eventDate: event.eventDate,
      eventPhoto: event.eventPhoto,
      presenceId: presences.find(
        (presence) => presence.eventId === event.eventId
      )!.presenceId,
    }));

    return [profile, presencesReturn];
  }
}
