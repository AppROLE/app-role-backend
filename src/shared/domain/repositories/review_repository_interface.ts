import { Review } from "../entities/review";

export interface IReviewRepository {
  createReview(review: Review): Promise<Review>;
  getReviewsByEventId(eventId: string): Promise<Review[]>;
  getReviewsByUserId(userId: string): Promise<Review[]>;
  deleteReviewById(reviewId: string): Promise<void>;
}
