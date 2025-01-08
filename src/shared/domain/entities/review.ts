export interface ReviewProps {
    userId: string;
    reviewId: string;
    eventId: string;
    review: string;
    rating: number;
    createdAt: Date;
}

export class Review {
    reviewId: string;
    userId: string;
    eventId: string;
    review: string;
    rating: number;
    createdAt: Date;

    constructor(props: ReviewProps) {
        this.userId = props.userId;
        this.reviewId = props.reviewId;
        this.eventId = props.eventId;
        this.review = props.review;
        this.rating = props.rating;
        this.createdAt = props.createdAt;
    }
}