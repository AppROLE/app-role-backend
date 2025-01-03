import { IEventRepository } from "src/shared/domain/repositories/event_repository_interface";
import { Repository } from "src/shared/infra/database/repositories/repository";

export class GetAllConfirmedEventsUseCase {
  repository: Repository;
  private readonly event_repo: IEventRepository;

  constructor() {
    this.repository = new Repository({
      event_repo: true,
    });
    this.event_repo = this.repository.event_repo!;
  }

  async execute(username: string, isMyEvents: boolean, myUsername: string) {
    if (!username) throw new Error("Username is required");

    return this.event_repo.getAllConfirmedEvents(
      username,
      isMyEvents,
      myUsername
    );
  }
}
