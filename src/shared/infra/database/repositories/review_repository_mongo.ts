import { Review } from "src/shared/domain/entities/review";
import { IReviewRepository } from "src/shared/domain/repositories/review_repository_interface";
import { IReview } from "../models/review.model";
import { Collection, Connection } from "mongoose";
import { ReviewDTO } from "../dtos/review_dto";

export class ReviewRepositoryMongo implements IReviewRepository {
  private reviewCollection: Collection<IReview>;

  constructor(connection: Connection) {
    this.reviewCollection = connection.collection<IReview>("Review");
  }

  async createReview(review: Review): Promise<Review> {
    const reviewDoc = ReviewDTO.fromEntity(review).toMongo();
    const result = await this.reviewCollection.insertOne(reviewDoc);

    if (!result.acknowledged) {
      throw new Error("Erro ao criar revisão no MongoDB.");
    }

    const createdReview = await this.reviewCollection.findOne({
      _id: reviewDoc._id,
    });
    if (!createdReview) {
      throw new Error("Erro ao buscar a revisão criada no MongoDB.");
    }

    return ReviewDTO.fromMongo(createdReview).toEntity();
  }

  async getReviewsByEventId(eventId: string): Promise<Review[]> {
    const reviewsCursor = this.reviewCollection.find({ eventId });
    const reviewsArray = await reviewsCursor.toArray();

    return reviewsArray.map((review) => ReviewDTO.fromMongo(review).toEntity());
  }

  async getReviewsByUserId(userId: string): Promise<Review[]> {
    const reviewsCursor = this.reviewCollection.find({ userId });
    const reviewsArray = await reviewsCursor.toArray();

    return reviewsArray.map((review) => ReviewDTO.fromMongo(review).toEntity());
  }

  async deleteReviewById(reviewId: string): Promise<void> {
    const result = await this.reviewCollection.deleteOne({ _id: reviewId });
    if (result.deletedCount === 0) {
      throw new Error(`Revisão com ID ${reviewId} não encontrada.`);
    }
  }
}
