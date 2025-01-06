import { Event } from 'src/shared/domain/entities/event';
import { IEventRepository } from 'src/shared/domain/repositories/event_repository_interface';
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

  execute(): Promise<Event[]> {
    const events = this.event_repo!.getAllEvents();
    return events;
  }

  executeFromToday(page: number): Promise<Event[]> {
    const events = this.event_repo!.getAllEventsFromToday(page);
    return events;
  }
}
