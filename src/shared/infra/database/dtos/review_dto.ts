import { Review } from "src/shared/domain/entities/review";
import { IReview, ReviewModel } from "../models/review.model";

export interface ReviewDTOProps {
    _id: string,
    reviewId: string;
    eventId: string;
    review: string;
    rating: number;
    createdAt: Date;
}

export class ReviewDTO {
    _id: string;
    reviewId: string;
    eventId: string;
    review: string;
    rating: number;
    createdAt: Date;
    constructor(props: ReviewDTOProps) {
        this._id = props._id;
        this.reviewId = props.reviewId;
        this.eventId = props.eventId;
        this.review = props.review;
        this.rating = props.rating;
        this.createdAt = props.createdAt;
    }

    static fromMongo(review: any): ReviewDTO {
        return new ReviewDTO({
            _id: review._id,
            reviewId: review.reviewId,
            eventId: review.eventId,
            review: review.review,
            rating: review.rating,
            createdAt: review.createdAt,
        });
    }

    static toMongo(review: ReviewDTO): IReview {
        return new ReviewModel({
            _id: review._id,
            reviewId: review.reviewId,
            eventId: review.eventId,
            review: review.review,
            rating: review.rating,
            createdAt: review.createdAt,
        });
    }

    static fromEntity(review: Review): ReviewDTO {
        return new ReviewDTO({
            _id: review.reviewId,
            reviewId: review.reviewId,
            eventId: review.eventId,
            review: review.review,
            rating: review.rating,
            createdAt: review.createdAt,
        });
    }

    static toEntity(review: ReviewDTO): Review {
        return new Review({
            reviewId: review.reviewId,
            eventId: review.eventId,
            userId: review._id,
            review: review.review,
            rating: review.rating,
            createdAt: review.createdAt,
        });
    }
}