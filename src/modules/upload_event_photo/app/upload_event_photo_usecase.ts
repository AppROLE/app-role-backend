import { IEventRepository } from "src/shared/domain/repositories/event_repository_interface";
import { IFileRepository } from "src/shared/domain/repositories/file_repository_interface";
import { Environments } from "src/shared/environments";
import { NoItemsFound } from "src/shared/helpers/errors/usecase_errors";
import { Repository } from "src/shared/infra/database/repositories/repository";

export class UploadEventPhotoUseCase {
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

  async execute(eventId: string, eventPhoto: Buffer, mimetype: string) {
    const event = await this.event_repo.getEventById(eventId);

    if (!event) {
      throw new NoItemsFound("Evento");
    }

    const imageKey = `events/${eventId}/event-photo.${mimetype.split("/")[1]}`;

    await this.file_repo.uploadEventPhoto(imageKey, eventPhoto, mimetype);

    await this.event_repo.updateEventPhoto(
      eventId,
      `${Environments.cloudFrontUrl}/${imageKey}`
    );
  }
}
