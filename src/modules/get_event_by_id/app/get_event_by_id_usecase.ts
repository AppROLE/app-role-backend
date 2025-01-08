import { Event } from "src/shared/domain/entities/event";
import { IEventRepository } from "src/shared/domain/repositories/event_repository_interface";
import { NoItemsFound } from "src/shared/helpers/errors/errors";
import { Repository } from "src/shared/infra/database/repositories/repository";

export class GetEventByIdUseCase {
  repository: Repository;
  private event_repo?: IEventRepository;

  constructor() {
    this.repository = new Repository({
      event_repo: true,
    });
  }

  async connect() {
    await this.repository.connectRepository();
    this.event_repo = this.repository.event_repo;

    if (!this.event_repo)
      throw new Error('Expected to have an instance of the event repository');
  }

  async execute(eventId: string): Promise<Event> {
    const event = await this.event_repo!.getEventById(eventId);
    if (!event) {
      throw new NoItemsFound("event");
    }
    return event;
  }
}
