import { IEventRepository } from "src/shared/domain/repositories/event_repository_interface";
import { IPresenceRepository } from "src/shared/domain/repositories/presence_repository_interface";
import { NoItemsFound } from "src/shared/helpers/errors/usecase_errors";
import { Repository } from "src/shared/infra/database/repositories/repository";

export class UnConfirmEventUseCase {
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
      throw new Error('Expected to have an instance of the presence repository');
  }

  async execute(eventId: string, username: string) {
    const event = await this.event_repo!.getEventById(eventId);

    if (!event) throw new NoItemsFound("eventId");

    const presenceExists = await this.presence_repo!.getPresenceByEventAndUser(
      eventId,
      username
    );

    if (!presenceExists) throw new NoItemsFound("presence");

    await this.presence_repo!.unConfirmPresence(eventId, username);
  }
}
