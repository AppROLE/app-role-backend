import { IEventRepository } from 'src/shared/domain/repositories/event_repository_interface';
import { IPresenceRepository } from 'src/shared/domain/repositories/presence_repository_interface';
import { IProfileRepository } from 'src/shared/domain/repositories/profile_repository_interface';
import { NoItemsFound } from 'src/shared/helpers/errors/errors';
import { Repository } from 'src/shared/infra/database/repositories/repository';

export class UnconfirmPresenceUsecase {
  repository: Repository;
  private event_repo?: IEventRepository;
  private presence_repo?: IPresenceRepository;
  private profile_repo?: IProfileRepository;

  constructor() {
    this.repository = new Repository({
      event_repo: true,
      presence_repo: true,
      profile_repo: true,
    });
  }

  async connect() {
    await this.repository.connectRepository();
    this.event_repo = this.repository.event_repo;
    this.presence_repo = this.repository.presence_repo;
    this.profile_repo = this.repository.profile_repo;

    if (!this.event_repo)
      throw new Error('Expected to have an instance of the event repository');
    if (!this.presence_repo)
      throw new Error(
        'Expected to have an instance of the presence repository'
      );
    
    if (!this.profile_repo)
      throw new Error('Expected to have an instance of the profile repository');
  }

  async execute(eventId: string, userId: string) {
    const profile = await this.profile_repo!.getByUserId(userId);

    if (!profile) throw new NoItemsFound('Perfil não encontrado');

    const event = await this.event_repo!.getEventById(eventId);

    if (!event) throw new NoItemsFound('eventId');

    const presenceExists = await this.presence_repo!.getPresencesByEventAndUser(
      eventId,
      userId
    );

    if (!presenceExists) throw new NoItemsFound('Usuário não confirmou presença ainda');

    await this.presence_repo!.deletePresence(eventId, userId);

    await this.profile_repo!.updateProfile(userId, {
      presencesId: profile.presencesId.filter(
        (presenceId) => presenceId !== presenceExists.presenceId
      ),
    });

    await this.event_repo!.updateEvent(eventId, {
      presencesId: event.presencesId.filter(
        (presenceId) => presenceId !== presenceExists.presenceId
      ),
    });
  }
}
