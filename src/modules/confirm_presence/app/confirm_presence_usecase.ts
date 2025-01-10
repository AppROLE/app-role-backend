import { Presence } from 'src/shared/domain/entities/presence';
import { IEventRepository } from 'src/shared/domain/repositories/event_repository_interface';
import { IPresenceRepository } from 'src/shared/domain/repositories/presence_repository_interface';
import {
  NoItemsFound,
  UserAlreadyConfirmedEvent,
} from 'src/shared/helpers/errors/errors';
import { uuidv4 } from 'src/shared/helpers/utils/uuid_util';
import { Repository } from 'src/shared/infra/database/repositories/repository';

export class ConfirmPresenceUsecase {
  repository: Repository;
  private event_repo?: IEventRepository;
  private presence_repo?: IPresenceRepository;

  constructor() {
    this.repository = new Repository({
      event_repo: true,
      presence_repo: true,
    });
  }

  async connect() {
    await this.repository.connectRepository();
    this.event_repo = this.repository.event_repo;
    this.presence_repo = this.repository.presence_repo;

    if (!this.event_repo)
      throw new Error('Expected to have an instance of the event repository');

    if (!this.presence_repo)
      throw new Error(
        'Expected to have an instance of the presence repository'
      );
  }

  async execute(
    eventId: string,
    userId: string,
    promoterCode?: string
  ): Promise<Presence> {
    const event = await this.event_repo!.getEventById(eventId);

    if (!event) throw new NoItemsFound('eventId');

    const alreadyConfirmed =
      await this.presence_repo!.getPresencesByEventAndUser(eventId, userId);

    if (alreadyConfirmed) throw new UserAlreadyConfirmedEvent();

    const presence = new Presence({
      presenceId: uuidv4(),
      eventId: event.eventId,
      userId: userId,
      promoterCode: promoterCode,
      createdAt: new Date().getTime(),
    });

    return await this.presence_repo!.createPresence(presence);
  }
}
