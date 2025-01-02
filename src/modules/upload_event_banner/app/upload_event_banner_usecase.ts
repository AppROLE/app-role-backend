import { IEventRepository } from "src/shared/domain/repositories/event_repository_interface";
import { IFileRepository } from "src/shared/domain/repositories/file_repository_interface";
import { Environments } from "src/shared/environments";
import { EntityError } from "src/shared/helpers/errors/domain_errors";
import { NoItemsFound } from "src/shared/helpers/errors/usecase_errors";
import { Repository } from "src/shared/infra/database/repositories/repository";

export class UploadEventBannerUseCase {
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
    console.log(
      "Executando UploadEventBannerUseCase para o evento ID:",
      eventId
    );
    const event = await this.event_repo.getEventById(eventId);
    if (!event) {
      console.log("Evento não encontrado.");
      throw new NoItemsFound("Evento");
    }

    const allowedMimeTypes = ["image/jpeg", "image/png", "image/jpg"];
    if (!allowedMimeTypes.includes(mimetype)) {
      throw new EntityError("Tipo de arquivo não permitido para o banner.");
    }

    const nameFormat = event.getEventName
      .trim()
      .replace(/\s+/g, "+")
      .replace(/[^a-zA-Z0-9+]/g, "");
    const imageKey = `events/${eventId}/banner.${mimetype.split("/")[1]}`;
    console.log("Chave da imagem gerada:", imageKey);

    await this.file_repo.uploadEventPhoto(imageKey, eventPhoto, mimetype);

    console.log("Banner do evento enviado para o S3 com sucesso.");

    await this.event_repo.updateEventBanner(
      eventId,
      `${Environments.cloudFrontUrl}/${imageKey}`
    );
    console.log("Link do banner atualizado no MongoDB.");
  }
}
