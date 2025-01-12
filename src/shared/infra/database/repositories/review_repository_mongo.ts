import { Review } from 'src/shared/domain/entities/review';
import { IReviewRepository } from 'src/shared/domain/repositories/review_repository_interface';
import { IReview, ReviewModel } from '../models/review.model';
import { ReviewDTO } from '../dtos/review_dto';
import { NoItemsFound } from 'src/shared/helpers/errors/errors';

export class ReviewRepositoryMongo implements IReviewRepository {

  async createReview(review: Review): Promise<Review> {
    const reviewDoc = ReviewDTO.fromEntity(review).toMongo();
    const result = await ReviewModel.create(reviewDoc);

    return ReviewDTO.fromMongo(result).toEntity();
  }

  async getReviewsByEventId(eventId: string): Promise<Review[]> {
    const reviewsArray = await ReviewModel.find({ eventId }).lean();

    return reviewsArray.map((review) => ReviewDTO.fromMongo(review).toEntity());
  }

  async getReviewsByUserId(userId: string): Promise<Review[]> {
    const reviewsArray = await ReviewModel.find({ userId }).lean();

    return reviewsArray.map((review) => ReviewDTO.fromMongo(review).toEntity());
  }

  async deleteReviewById(reviewId: string): Promise<void> {
    const result = await ReviewModel.deleteOne({ _id: reviewId });
    if (result.deletedCount === 0) {
      throw new NoItemsFound(`Review com ID ${reviewId} não encontrada.`);
    }
  }
}
