import { IEventRepository } from 'src/shared/domain/repositories/event_repository_interface';
import { EventPagination } from 'src/shared/helpers/types/event_pagination';
import { Repository } from 'src/shared/infra/database/repositories/repository';

export class GetEventsByFilterUseCase {
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

  async execute(page: number, filters: any): Promise<EventPagination> {
    const sanitizedFilters = this.sanitizeFilters(filters);

    const result = await this.event_repo!.getEventsByFilter(
      page,
      sanitizedFilters
    );
    return result;
  }

  private sanitizeFilters(filters: any): any {
    const sanitizedFilters: any = {};

    if (filters.name && typeof filters.name === 'string') {
      sanitizedFilters.name = filters.name.replace(/\+/g, ' ');
    }

    if (filters.price) {
      const price = Number(filters.price);
      if (!isNaN(price)) {
        sanitizedFilters.price = price;
      }
    }

    if (filters.eventDate && !isNaN(new Date(filters.eventDate).getTime())) {
      sanitizedFilters.eventDate = filters.eventDate;
    }

    if (filters.instituteId) {
      sanitizedFilters.instituteId = filters.instituteId;
    }

    if (filters.musicType) {
      sanitizedFilters.musicType = filters.musicType;
    }

    if (filters.features) {
      sanitizedFilters.features = filters.features;
    }

    if (filters.category) {
      sanitizedFilters.category = filters.category;
    }

    return sanitizedFilters;
  }
}
