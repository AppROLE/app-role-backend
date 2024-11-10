import { IEventRepository } from "src/shared/domain/irepositories/event_repository_interface";
import { IFileRepository } from "src/shared/domain/irepositories/file_repository_interface";
import { Environments } from "src/shared/environments";
import { FailedToAddToGallery } from "src/shared/helpers/errors/usecase_errors";

export class UploadGalleryEventUseCase {
  constructor(
    private readonly eventRepo: IEventRepository,
    private readonly fileRepo: IFileRepository
  ) {}

  async execute(
    eventId: string,
    eventPhoto: Buffer,
    typePhoto: string,
    mimetype: string
  ) {
    const event = await this.eventRepo.getEventById(eventId);
    const eventName = event.getEventName;
    const nameFormat = eventName.replace(/\s+/g, "-");

    const numberImages = await this.eventRepo.countGalleryEvent(eventId);

    if (numberImages.valueOf() >= 5) {
      throw new FailedToAddToGallery();
    }

    const imageKey = `${nameFormat}-${numberImages.valueOf() + 1}${typePhoto}`;

    await this.eventRepo.updateGalleryArray(
      eventId,
      `${Environments.getEnvs().cloudFrontUrl}/${imageKey}`
    );

    await this.fileRepo.uploadEventGalleryPhoto(
      eventId,
      nameFormat,
      imageKey,
      eventPhoto,
      mimetype
    );
  }
}
