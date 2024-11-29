import { IEventRepository } from "src/shared/domain/irepositories/event_repository_interface";
import { IFileRepository } from "src/shared/domain/irepositories/file_repository_interface";
import { Environments } from "src/shared/environments";
import { FailedToAddToGallery, NoItemsFound } from "src/shared/helpers/errors/usecase_errors";

export class UploadGalleryEventUseCase {
  constructor(
    private readonly eventRepo: IEventRepository,
    private readonly fileRepo: IFileRepository
  ) {}

  async execute(
    eventId: string,
    eventPhoto: Buffer,
    mimetype: string
  ) {
    const event = await this.eventRepo.getEventById(eventId);
    if (!event) {
      throw new NoItemsFound("Evento");
    }

    const numberImages = await this.eventRepo.countGalleryEvent(eventId);

    if (numberImages.valueOf() >= 5) {
      throw new FailedToAddToGallery();
    }

    const imageKey = `events/${eventId}/gallery/photo-gallery-${numberImages.valueOf() + 1}.${mimetype.split("/")[1]}`;

    await this.eventRepo.updateGalleryArray(
      eventId,
      `${Environments.getEnvs().cloudFrontUrl}/${imageKey}`
    );

    await this.fileRepo.uploadEventGalleryPhoto(
      imageKey,
      eventPhoto,
      mimetype
    );
  }
}
