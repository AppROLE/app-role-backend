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
    console.log(
      "Executando UploadEventBannerUseCase para o evento ID:",
      eventId
    );
    const event = await this.mongoRepo.getEventById(eventId);
    if (!event) {
      console.log("Evento não encontrado.");
      throw new NoItemsFound("Evento");
    }

    const allowedMimeTypes = ["image/jpeg", "image/png", "image/jpg"];
    if (!allowedMimeTypes.includes(mimetype)) {
      throw new EntityError("Tipo de arquivo não permitido para o banner.");
    }

    const nameFormat = event.getEventName.trim().replace(/\s+/g, "+").replace(/[^a-zA-Z0-9+]/g, "");
    const imageKey = `events/${eventId}/banner.${extensionName.split("/")[1]}`;
    console.log("Chave da imagem gerada:", imageKey);

    await this.fileRepo.uploadEventBanner(
      imageKey,
      eventPhoto,
      mimetype
    );

    console.log("Banner do evento enviado para o S3 com sucesso.");

    await this.mongoRepo.updateEventBanner(
      eventId,
      `${Environments.getEnvs().cloudFrontUrl}/${imageKey}`
    );
    console.log("Link do banner atualizado no MongoDB.");
  }
}
