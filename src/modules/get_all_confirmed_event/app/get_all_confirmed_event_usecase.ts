import { IEventRepository } from "src/shared/domain/repositories/event_repository_interface";
import { Repository } from "src/shared/infra/database/repositories/repository";

export class GetAllConfirmedEventsUseCase {
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

  async execute(username: string, isMyEvents: boolean, myUsername: string) {
    if (!username) throw new Error("Username is required");

    return this.event_repo!.getAllConfirmedEvents(
      username,
      isMyEvents,
      myUsername
    );
  }
}
