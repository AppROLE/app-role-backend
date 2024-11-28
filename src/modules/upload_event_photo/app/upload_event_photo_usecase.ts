import { IEventRepository } from "src/shared/domain/irepositories/event_repository_interface";
import { IFileRepository } from "src/shared/domain/irepositories/file_repository_interface";
import { Environments } from "src/shared/environments";
import { EntityError } from "src/shared/helpers/errors/domain_errors";
import { NoItemsFound } from "src/shared/helpers/errors/usecase_errors";

export class UploadEventPhotoUseCase {
  constructor(
    private readonly mongoRepo: IEventRepository,
    private readonly fileRepo: IFileRepository
  ) {}

  async execute(
    eventId: string,
    eventPhoto: Buffer,
    mimetype: string
  ) {
    const event = await this.mongoRepo.getEventById(eventId);

    if (!event) {
      throw new NoItemsFound("Evento");
    }

    const imageKey = `events/${eventId}/event-photo.${mimetype.split("/")[1]}`;

    await this.fileRepo.uploadEventPhoto(imageKey, eventPhoto, mimetype);

    await this.mongoRepo.updateEventPhoto(
      eventId,
      `${Environments.getEnvs().cloudFrontUrl}/${imageKey}`
    );
  }
}
