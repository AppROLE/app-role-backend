import { Review } from 'src/shared/domain/entities/review';
import { IReview, ReviewModel } from '../models/review.model';

export interface ReviewDTOProps {
  reviewId: string;
  userId: string;
  eventId: string;
  instituteId: string;
  review: string;
  rating: number;
  createdAt: number;
}

export class ReviewDTO {
  reviewId: string;
  userId: string;
  eventId: string;
  instituteId: string;
  review: string;
  rating: number;
  createdAt: number;

  constructor(props: ReviewDTOProps) {
    this.reviewId = props.reviewId;
    this.userId = props.userId;
    this.eventId = props.eventId;
    this.instituteId = props.instituteId;
    this.review = props.review;
    this.rating = props.rating;
    this.createdAt = props.createdAt;
  }

  static fromMongo(review: IReview): ReviewDTO {
    return new ReviewDTO({
      reviewId: review._id,
      userId: review.userId,
      eventId: review.eventId,
      instituteId: review.instituteId,
      review: review.review,
      rating: review.rating,
      createdAt: review.createdAt.getTime(),
    });
  }

  toMongo(): IReview {
    return new ReviewModel({
      _id: this.reviewId,
      userId: this.userId,
      eventId: this.eventId,
      instituteId: this.instituteId,
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
      instituteId: review.instituteId,
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
      instituteId: this.instituteId,
      review: this.review,
      rating: this.rating,
      createdAt: this.createdAt,
    });
  }
}
