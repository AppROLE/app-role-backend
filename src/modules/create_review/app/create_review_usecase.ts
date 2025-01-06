import { IEventRepository } from "src/shared/domain/repositories/event_repository_interface";
import { EntityError } from "src/shared/helpers/errors/domain_errors";
import { Repository } from "src/shared/infra/database/repositories/repository";

export class CreateReviewUseCase {
  repository: Repository;
  private readonly event_repo: IEventRepository;

  constructor() {
    this.repository = new Repository({
      event_repo: true,
    });
    this.event_repo = this.repository.event_repo!;
  }

  async execute(
    star: number,
    review: string,
    reviewedAt: number,
    eventId: string,
    username: string,
    name: string,
    photoUrl: string
  ) {
    if (star < 0 || star > 5) {
      throw new EntityError("star");
    }
    if (review.length < 5 || review.length > 250) {
      throw new EntityError("review");
    }
    if (reviewedAt < 0) {
      throw new EntityError("reviewedAt");
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

    const reviwedDate = new Date(reviewedAt);

    await this.event_repo.createReview(
      star,
      review,
      reviwedDate,
      eventId,
      name,
      photoUrl,
      username
    );
  }
}
