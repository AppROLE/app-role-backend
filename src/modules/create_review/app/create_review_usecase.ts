import { IEventRepository } from "src/shared/domain/repositories/event_repository_interface";
import { EntityError } from "src/shared/helpers/errors/errors";
import { Repository } from "src/shared/infra/database/repositories/repository";

export class CreateReviewUseCase {
  repository: Repository;
  private event_repo?: IEventRepository;

  constructor() {
    this.repository = new Repository({
      event_repo: true,
    });
  }

  async connect() {
    await this.repository.connectRepository();
    this.event_repo = this.repository.event_repo;

    if (!this.event_repo)
      throw new Error('Expected to have an instance of the event repository');
  }

  async execute(
    rating: number,
    review: string,
    createdAt: number,
    eventId: string,
    username: string,
    name: string,
    photoUrl: string
  ) {
    if (rating < 0 || rating > 5) {
      throw new EntityError("rating");
    }
    if (review.length < 5 || review.length > 250) {
      throw new EntityError("review");
    }
    if (createdAt < 0) {
      throw new EntityError("createdAt");
    }
    if (eventId.length < 1 || eventId.trim() === "") {
      throw new EntityError("eventId");
    }
    if (username.length < 1 || username.trim() === "") {
      throw new EntityError("username");
    }
    if (photoUrl.length < 1 || photoUrl.trim() === "") {
      throw new EntityError("photoUrl");
    }

    const reviwedDate = new Date(createdAt);

    await this.event_repo!.createReview(
      rating,
      review,
      reviwedDate,
      eventId,
      name,
      photoUrl,
      username
    );
  }
}
