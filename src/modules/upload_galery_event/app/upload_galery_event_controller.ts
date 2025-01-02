import { MissingParameters } from "src/shared/helpers/errors/controller_errors";
import { UploadGalleryEventUseCase } from "./upload_galery_event_usecase";
import { UploadGalleryEventViewmodel } from "./upload_galery_event_viewmodel";
import {
  BadRequest,
  InternalServerError,
  NotFound,
  OK,
} from "src/shared/helpers/external_interfaces/http_codes";
import { EntityError } from "src/shared/helpers/errors/domain_errors";
import {
  FailedToAddToGallery,
  NoItemsFound,
} from "src/shared/helpers/errors/usecase_errors";
import { IRequest } from "src/shared/helpers/external_interfaces/external_interface";

export class UploadGalleryEventController {
  constructor(private readonly usecase: UploadGalleryEventUseCase) {}

  async handle(request: IRequest, formData: any) {
    try {
      const eventId = formData.fields.eventId;
      const typePhoto = formData.fields.typePhoto;

      if (!eventId) {
        throw new MissingParameters("eventId");
      }
      if (!typePhoto) {
        throw new MissingParameters("typePhoto");
      }

      const imagesBuffers = formData.files.map((file: any) => {
        return file.data;
      }) as Buffer[];

      const mimetypes = formData.files.map((file: any) => {
        return file.mimeType;
      }) as string[];

      await this.usecase.execute(eventId, imagesBuffers[0], mimetypes[0]);

      const viewmodel = new UploadGalleryEventViewmodel(
        "A foto do ROLE foi adicionada na galeria com sucesso!"
      );

      return new OK(viewmodel.toJSON());
    } catch (error: any) {
      if (error instanceof FailedToAddToGallery) {
        return new BadRequest(error.message);
      }
      if (error instanceof EntityError) {
        return new BadRequest(error.message);
      }
      if (error instanceof NoItemsFound) {
        return new NotFound(error.message);
      }
      if (error instanceof MissingParameters) {
        return new BadRequest(error.message);
      }
      if (error instanceof Error) {
        return new InternalServerError(
          "Internal Server Error, error: " + error.message
        );
      }
    } finally {
      await this.usecase.repository.closeSession();
    }
  }
}
