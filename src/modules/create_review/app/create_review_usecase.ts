import { Review } from 'src/shared/domain/entities/review';
import { IEventRepository } from 'src/shared/domain/repositories/event_repository_interface';
import { IProfileRepository } from 'src/shared/domain/repositories/profile_repository_interface';
import { IReviewRepository } from 'src/shared/domain/repositories/review_repository_interface';
import { EntityError, NoItemsFound } from 'src/shared/helpers/errors/errors';
import { uuidv4 } from 'src/shared/helpers/utils/uuid_util';
import { Repository } from 'src/shared/infra/database/repositories/repository';

export class CreateReviewUseCase {
  repository: Repository;
  private event_repo?: IEventRepository;
  private review_repo?: IReviewRepository;
  private profile_repo?: IProfileRepository;

  constructor() {
    this.repository = new Repository({
      event_repo: true,
      review_repo: true,
      profile_repo: true,
    });
  }

  async connect() {
    await this.repository.connectRepository();
    this.event_repo = this.repository.event_repo;
    this.review_repo = this.repository.review_repo;
    this.profile_repo = this.repository.profile_repo;

    if (!this.event_repo)
      throw new Error('Expected to have an instance of the event repository');

    if (!this.review_repo)
      throw new Error('Expected to have an instance of the review repository');

    if (!this.profile_repo)
      throw new Error('Expected to have an instance of the profile repository');
  }

  async execute(
    review: string,
    rating: number,
    eventId: string,
    userId: string
  ): Promise<Review> {
    if (rating < 0 || rating > 5) {
      throw new EntityError('rating');
    }
    if (review.length < 5 || review.length > 250) {
      throw new EntityError('review');
    }

    const event = await this.event_repo!.getEventById(eventId);

    if (!event) throw new NoItemsFound('event');

    const reviewToCreate = new Review({
      reviewId: uuidv4(),
      userId: userId,
      eventId: eventId,
      review: review,
      rating: rating,
      createdAt: new Date().getTime(),
    });

    const reviewCreated = await this.review_repo!.createReview(reviewToCreate);

    await this.event_repo!.updateEvent(eventId, { reviewsId: [...event.reviewsId, reviewCreated.reviewId] });
    await this.profile_repo!.updateProfile(userId, { reviewsId: [...event.reviewsId, reviewCreated.reviewId] });

    return reviewCreated;
  }
}
