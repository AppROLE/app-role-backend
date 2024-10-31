import { IEventRepository } from "src/shared/domain/irepositories/event_repository_interface";
import { IFileRepository } from "src/shared/domain/irepositories/file_repository_interface";
import { Environments } from "src/shared/environments";
import { EntityError } from "src/shared/helpers/errors/domain_errors";
import { NoItemsFound } from "src/shared/helpers/errors/usecase_errors";

export class UploadEventBannerUseCase {
  constructor(
    private readonly mongoRepo: IEventRepository,
    private readonly fileRepo: IFileRepository
  ) {}

  async execute(
    eventId: string,
    eventPhoto: Buffer,
    extensionName: string,
    mimetype: string
  ) {
    console.log("EVENT ID PORRA" + eventId);
    const event = await this.mongoRepo.getEventById(eventId);

    if (!event) {
      throw new NoItemsFound("Evento");
    }

    // isso seria legal de implementar, uma validaçao de tamanho de imagem
    // caso não for da extensão correta, ou do tamanho correto, retornar um erro
    // teria de criar o erro
    const allowedMimeTypes = ["image/jpeg", "image/png", "image/jpg"];

    const nameFormat = event.getEventName.replace(/\s/g, "+");

    const imageKey = `${eventId}-${nameFormat}-banner${extensionName}`;

    await this.fileRepo.uploadEventPhoto(imageKey, eventPhoto, mimetype);

    await this.mongoRepo.updateEventBanner(
      eventId,
      `${Environments.getEnvs().cloudFrontUrl}/${imageKey}`
    );
  }
}
