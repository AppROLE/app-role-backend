import { IEventRepository } from "src/shared/domain/repositories/event_repository_interface";
import { IFileRepository } from "src/shared/domain/repositories/file_repository_interface";
import { NoItemsFound } from "src/shared/helpers/errors/usecase_errors";
import { Repository } from "src/shared/infra/database/repositories/repository";

export class DeleteEventByIdUseCase {
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

  async execute(eventId: string): Promise<void> {
    const event = await this.event_repo.getEventById(eventId);
    if (!event) {
      throw new NoItemsFound("event");
    }

    const eventName = event?.getEventName;
    if (event?.getEventPhotoLink) {
      await this.file_repo.deleteEventPhotoByEventId(eventId);
    }
    if ((event?.getGaleryLink?.length ?? 0) > 0) {
      await this.file_repo.deleteGallery(eventId);
    }
    if ((event?.getEventBannerUrl?.length ?? 0) > 0) {
      await this.file_repo.deleteEventBanner(eventId, eventName);
    }
    await this.event_repo.deleteEventById(eventId);
  }
}
