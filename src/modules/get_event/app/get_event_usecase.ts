import { Event } from 'src/shared/domain/entities/event';
import { Review } from 'src/shared/domain/entities/review';
import { IEventRepository } from 'src/shared/domain/repositories/event_repository_interface';
import { IReviewRepository } from 'src/shared/domain/repositories/review_repository_interface';
import { NoItemsFound } from 'src/shared/helpers/errors/errors';
import { Repository } from 'src/shared/infra/database/repositories/repository';

export class GetEventUseCase {
  repository: Repository;
  private event_repo?: IEventRepository;
  private review_repo?: IReviewRepository;

  constructor() {
    this.repository = new Repository({
      event_repo: true,
      review_repo: true,
    });
  }

  async connect() {
    await this.repository.connectRepository();
    this.event_repo = this.repository.event_repo;
    this.review_repo = this.repository.review_repo;

    if (!this.event_repo)
      throw new Error('Expected to have an instance of the event repository');

    if (!this.review_repo)
      throw new Error('Expected to have an instance of the review repository');
  }

  async execute(eventId: string): Promise<[Event, Review[]]> {
    const event = await this.event_repo!.getEventById(eventId);
    if (!event) throw new NoItemsFound('event');

    const reviews = await this.review_repo!.getReviewsByEventId(eventId);

    return [event, reviews];
  }
}
