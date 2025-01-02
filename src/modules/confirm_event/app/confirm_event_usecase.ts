import { IEventRepository } from "src/shared/domain/repositories/event_repository_interface";
import { IPresenceRepository } from "src/shared/domain/repositories/presence_repository_interface";
import {
  NoItemsFound,
  UserAlreadyConfirmedEvent,
} from "src/shared/helpers/errors/usecase_errors";
import { Repository } from "src/shared/infra/database/repositories/repository";

export class ConfirmEventUseCase {
  repository: Repository;
  private readonly event_repo: IEventRepository;
  private readonly presence_repo: IPresenceRepository;

  constructor() {
    this.repository = new Repository({
      event_repo: true,
      presence_repo: true,
    });
    this.event_repo = this.repository.event_repo!;
    this.presence_repo = this.repository.presence_repo!;
  }

  async execute(
    eventId: string,
    username: string,
    nickname: string,
    profilePhoto?: string,
    promoterCode?: string
  ) {
    const event = await this.event_repo.getEventById(eventId);

    if (!event) throw new NoItemsFound("eventId");

    const alreadyConfirmed = await this.presence_repo.getPresenceByEventAndUser(
      eventId,
      username
    );

    if (alreadyConfirmed) throw new UserAlreadyConfirmedEvent();

    await this.presence_repo.confirmPresence(
      eventId,
      username,
      nickname,
      profilePhoto,
      promoterCode
    );
  }
}
