import { Event } from 'src/shared/domain/entities/event';
import { IEventRepository } from 'src/shared/domain/repositories/event_repository_interface';
import { PaginationReturn } from 'src/shared/helpers/types/event_pagination';
import { Repository } from 'src/shared/infra/database/repositories/repository';

export class GetAllEventsUseCase {
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

  execute(page: number): Promise<PaginationReturn<Event>> {
    const result = this.event_repo!.getAllEventsPaginated(page);
    return result;
  }

  executeFromToday(page: number): Promise<PaginationReturn<Event>> {
    const result = this.event_repo!.getAllEventsFromToday(page);
    return result;
  }
}
