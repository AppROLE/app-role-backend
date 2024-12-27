import { Event } from "src/shared/domain/entities/event";
import { IEventRepository } from "src/shared/domain/irepositories/event_repository_interface";
import { NoItemsFound } from "src/shared/helpers/errors/usecase_errors";

export class GetAllEventsUseCase {
  constructor(private readonly repo: IEventRepository) {}

  execute(): Promise<Event[]> {
    const events = this.repo.getAllEvents();
    return events;
  }

  executeFromToday(page: number): Promise<Event[]> {
    const events = this.repo.getAllEventsFromToday(page);
    return events;
  }
}
