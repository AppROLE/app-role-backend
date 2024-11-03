import { Event } from "src/shared/domain/entities/event";
import { IEventRepository } from "src/shared/domain/irepositories/event_repository_interface";
import { NoItemsFound } from "src/shared/helpers/errors/usecase_errors";

export class GetAllEventsUseCase {
  constructor(private readonly repo: IEventRepository) {}

  execute(): Promise<Event[]> {
    const events = this.repo.getAllEvents();
    if (!events) {
      throw new NoItemsFound("eventos");
    }
    return events;
  }

  executeFromToday(): Promise<Event[]> {
    const events = this.repo.getAllEventsFromToday();
    if (!events) {
      throw new NoItemsFound("eventos");
    }
    return events;
  }
}
