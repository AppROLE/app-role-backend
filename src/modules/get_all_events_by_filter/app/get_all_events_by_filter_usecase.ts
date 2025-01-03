import { Event } from "src/shared/domain/entities/event";
import { IEventRepository } from "src/shared/domain/repositories/event_repository_interface";
import { NoItemsFound } from "src/shared/helpers/errors/usecase_errors";
import { Repository } from "src/shared/infra/database/repositories/repository";

export class GetEventsByFilterUseCase {
  repository: Repository;
  private readonly event_repo: IEventRepository;

  constructor() {
    this.repository = new Repository({
      event_repo: true,
    });
    this.event_repo = this.repository.event_repo!;
  }

  async execute(filter: any): Promise<Event[]> {
    const events = await this.event_repo.getEventsByFilter(filter);
    return events;
  }
}
