import { Review } from 'src/shared/domain/entities/review';
import { IEventRepository } from 'src/shared/domain/repositories/event_repository_interface';
import { IInstituteRepository } from 'src/shared/domain/repositories/institute_repository_interface';
import { IProfileRepository } from 'src/shared/domain/repositories/profile_repository_interface';
import { IReviewRepository } from 'src/shared/domain/repositories/review_repository_interface';
import {
  DuplicatedItem,
  EntityError,
  NoItemsFound,
} from 'src/shared/helpers/errors/errors';
import { uuidv4 } from 'src/shared/helpers/utils/uuid_util';
import { Repository } from 'src/shared/infra/database/repositories/repository';

export class CreateReviewUseCase {
  repository: Repository;
  private event_repo?: IEventRepository;
  private review_repo?: IReviewRepository;
  private profile_repo?: IProfileRepository;
  private institute_repo?: IInstituteRepository;

  constructor() {
    this.repository = new Repository({
      event_repo: true,
      review_repo: true,
      profile_repo: true,
      institute_repo: true,
    });
  }

  async connect() {
    await this.repository.connectRepository();
    this.event_repo = this.repository.event_repo;
    this.profile_repo = this.repository.profile_repo;
    this.review_repo = this.repository.review_repo;
    this.institute_repo = this.repository.institute_repo;

    if (!this.event_repo)
      throw new Error('Expected to have an instance of the event repository');

    if (!this.review_repo)
      throw new Error('Expected to have an instance of the review repository');

    if (!this.profile_repo)
      throw new Error('Expected to have an instance of the profile repository');

    if (!this.institute_repo)
      throw new Error(
        'Expected to have an instance of the institute repository'
      );
  }

  async execute(
    review: string,
    rating: number,
    eventId: string,
    userId: string
  ): Promise<Review> {
    const event = await this.event_repo!.getEventById(eventId);
    if (!event) throw new NoItemsFound('event');

    // Verifica se o usuário já fez uma review para o evento
    const existingReviews = await this.review_repo!.getReviewsByEventId(
      eventId
    );
    const userReview = existingReviews.find((r) => r.userId === userId);

    if (userReview) {
      throw new DuplicatedItem('Você já realizou uma review para este evento.');
    }

    const reviewToCreate = new Review({
      reviewId: uuidv4(),
      userId: userId,
      eventId: eventId,
      instituteId: event.instituteId,
      review: review,
      rating: rating,
      createdAt: new Date().getTime(),
    });

    const reviewCreated = await this.review_repo!.createReview(reviewToCreate);

    const institute = await this.institute_repo!.getInstituteById(
      event.instituteId
    );

    await this.institute_repo!.updateInstitute(event.instituteId, {
      reviewsId: [...institute!.reviewsId, reviewCreated.reviewId],
    });
    await this.profile_repo!.updateProfile(userId, {
      reviewsId: [...institute!.reviewsId, reviewCreated.reviewId],
    });

    return reviewCreated;
  }
}
