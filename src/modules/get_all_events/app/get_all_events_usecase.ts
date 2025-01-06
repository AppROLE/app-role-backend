import { Event } from "src/shared/domain/entities/event";
import { IEventRepository } from "src/shared/domain/repositories/event_repository_interface";
import { Repository } from "src/shared/infra/database/repositories/repository";

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
    console.log("repo: ", this.repository);
    const events = this.event_repo.getAllEvents();
    return events;
  }

  executeFromToday(page: number): Promise<Event[]> {
    const events = this.event_repo.getAllEventsFromToday(page);
    return events;
  }
}
