import { Review } from "src/shared/domain/entities/review";
import { IReview, ReviewModel } from "../models/review.model";

export interface ReviewDTOProps {
  reviewId: string;
  userId: string;
  eventId: string;
  review: string;
  rating: number;
  createdAt: number;
}

export class ReviewDTO {
  reviewId: string;
  userId: string;
  eventId: string;
  review: string;
  rating: number;
  createdAt: number;
  constructor(props: ReviewDTOProps) {
    this.reviewId = props.reviewId;
    this.userId = props.userId;
    this.eventId = props.eventId;
    this.review = props.review;
    this.rating = props.rating;
    this.createdAt = props.createdAt;
  }

  static fromMongo(review: IReview): ReviewDTO {
    return new ReviewDTO({
      reviewId: review._id,
      userId: review.userId,
      eventId: review.eventId,
      review: review.review,
      rating: review.rating,
      createdAt: review.createdAt,
    });
  }

  toMongo(): IReview {
    return new ReviewModel({
      _id: this.reviewId,
      userId: this.userId,
      eventId: this.eventId,
      review: this.review,
      rating: this.rating,
      createdAt: this.createdAt,
    });
  }

  static fromEntity(review: Review): ReviewDTO {
    return new ReviewDTO({
      reviewId: review.reviewId,
      userId: review.userId,
      eventId: review.eventId,
      review: review.review,
      rating: review.rating,
      createdAt: review.createdAt,
    });
  }

  toEntity(): Review {
    return new Review({
      reviewId: this.reviewId,
      eventId: this.eventId,
      userId: this.userId,
      review: this.review,
      rating: this.rating,
      createdAt: this.createdAt,
    });
  }
}
