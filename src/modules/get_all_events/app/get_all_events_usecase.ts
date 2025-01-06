import { Event } from "../../../shared/domain/entities/event";
import { IEventRepository } from "../../../shared/domain/repositories/event_repository_interface";
import { Repository } from "../../../shared/infra/database/repositories/repository";

export class GetAllEventsUseCase {
  repository: Repository;
  private readonly event_repo: IEventRepository;

  constructor() {
    this.repository = new Repository({
      event_repo: true,
    });
    this.event_repo = this.repository.event_repo!;
  }

  execute(): Promise<Event[]> {
    const events = this.event_repo.getAllEvents();
    return events;
  }

  executeFromToday(page: number): Promise<Event[]> {
    const events = this.event_repo.getAllEventsFromToday(page);
    return events;
  }
}
