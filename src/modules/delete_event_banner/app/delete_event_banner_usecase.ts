import { IEventRepository } from "src/shared/domain/irepositories/event_repository_interface";
import { IFileRepository } from "src/shared/domain/irepositories/file_repository_interface";
import {
  galleryEmpty,
  BannerEmpty,
  NoItemsFound,
} from "src/shared/helpers/errors/usecase_errors";

export class DeleteEventBannerUseCase {
  constructor(
    private readonly eventRepository: IEventRepository,
    private readonly fileRepository: IFileRepository
  ) {}

  async execute(eventId: string) {
    console.log("ESTOU NO USECASE - EVENT ID PORRA: ", eventId);
    const event = await this.eventRepository.getEventById(eventId);
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

    await this.fileRepository.deleteEventBanner(eventId, eventName);

    await this.eventRepository.updateEvent(eventId, {
      bannerUrl: "",
    });
  }
}
