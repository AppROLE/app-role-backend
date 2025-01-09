import { Review } from "src/shared/domain/entities/review";

export class CreateReviewViewModel {
  reviewId: string;
  userId: string;
  eventId: string;
  review: string;
  rating: number;
  createdAt: number;

  constructor(review: Review) {
    this.reviewId = review.reviewId;
    this.userId = review.userId;
    this.eventId = review.eventId;
    this.review = review.review;
    this.rating = review.rating;
    this.createdAt = review.createdAt;
  }

  toJSON() {
    return {
      reviewId: this.reviewId,
      userId: this.userId,
      eventId: this.eventId,
      review: this.review,
      rating: this.rating,
      createdAt: this.createdAt,
    };
  }
}
