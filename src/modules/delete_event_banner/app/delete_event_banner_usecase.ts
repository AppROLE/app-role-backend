import { IEventRepository } from "src/shared/domain/repositories/event_repository_interface";
import { IFileRepository } from "src/shared/domain/repositories/file_repository_interface";
import { Environments } from "src/shared/environments";
import {
  galleryEmpty,
  BannerEmpty,
  NoItemsFound,
} from "src/shared/helpers/errors/usecase_errors";
import { Repository } from "src/shared/infra/database/repositories/repository";

export class DeleteEventBannerUseCase {
  repository: Repository;
  private readonly event_repo: IEventRepository;
  private readonly file_repo: IFileRepository;

  constructor() {
    this.repository = new Repository({
      event_repo: true,
      file_repo: true,
    });
    this.event_repo = this.repository.event_repo!;
    this.file_repo = this.repository.file_repo!;
  }

  async execute(eventId: string) {
    console.log("ESTOU NO USECASE - EVENT ID PORRA: ", eventId);
    const event = await this.event_repo.getEventById(eventId);
    if (!event) {
      throw new NoItemsFound("evento");
    }
    console.log("EVENTO: ", event);
    console.log("ACHEI O EVENTO - ESTOU NO USECASE: ", event);
    if (!event?.getEventBannerUrl || event.getEventBannerUrl.length === 0) {
      throw new BannerEmpty();
    }

    const eventName = event.getEventName
      .trim()
      .replace(/\s+/g, "+")
      .replace(/[^a-zA-Z0-9+]/g, "");

    await this.file_repo.deleteEventBanner(eventId, eventName);

    await this.event_repo.updateEventBanner(eventId, "");
  }
}
