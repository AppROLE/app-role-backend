import { Profile } from "src/shared/domain/entities/profile";
import { IEventRepository } from "src/shared/domain/repositories/event_repository_interface";
import { IPresenceRepository } from "src/shared/domain/repositories/presence_repository_interface";
import { IProfileRepository } from "src/shared/domain/repositories/profile_repository_interface";
import { NoItemsFound } from "src/shared/helpers/errors/errors";
import { Repository } from "src/shared/infra/database/repositories/repository";

export class GetAllPresencesByEventIdUseCase {
  repository: Repository;
  private event_repo?: IEventRepository;
  private presence_repo?: IPresenceRepository;
  private profile_repo?: IProfileRepository;

  constructor() {
    this.repository = new Repository({
      event_repo: true,
      presence_repo: true,
      profile_repo: true,
    });
  }

  async connect() {
    await this.repository.connectRepository();
    this.event_repo = this.repository.event_repo;
    this.presence_repo = this.repository.presence_repo;
    this.profile_repo = this.repository.profile_repo;

    if (!this.event_repo)
      throw new Error("Expected to have an instance of the event repository");
    if (!this.presence_repo)
      throw new Error(
        "Expected to have an instance of the presence repository"
      );
    if (!this.profile_repo)
      throw new Error("Expected to have an instance of the profile repository");
  }

  async execute(eventId: string): Promise<Profile[]> {
    const event = await this.event_repo!.getEventById(eventId);

    if (!event) throw new NoItemsFound("eventId");

    const presences = await this.presence_repo!.getPresencesByEvent(eventId);

    if (!presences || presences.length === 0) {
      return [];
    }

    const profilesId = presences.map((presence) => presence.userId);

    return await this.profile_repo!.getProfilesByIds(profilesId);
  }
}
