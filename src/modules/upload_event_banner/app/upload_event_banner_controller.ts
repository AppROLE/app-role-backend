import { IRequest } from "src/shared/helpers/external_interfaces/external_interface";
import {
  BadRequest,
  InternalServerError,
  NotFound,
  OK,
} from "src/shared/helpers/external_interfaces/http_codes";
import { EntityError } from "src/shared/helpers/errors/domain_errors";
import { NoItemsFound } from "src/shared/helpers/errors/usecase_errors";
import { MissingParameters } from "src/shared/helpers/errors/controller_errors";
import { UploadEventBannerUseCase } from "./upload_event_banner_usecase";
import { UploadEventBannerViewmodel } from "./upload_event_banner_viewmodel";

export class UploadEventBannerController {
  constructor(private readonly usecase: UploadEventBannerUseCase) {}

  async handle(request: IRequest, formData: any) {
    try {
      console.log("CONTROLLER FORM DATA", formData);
      const eventId = formData.fields.eventId;

      if (!eventId) {
        throw new MissingParameters("eventId");
      }

      console.log("Event", eventId);

      const imagesBuffers = formData.files.map((file: any) => {
        return file.data;
      }) as Buffer[];

      const fieldNames = formData.files.map((file: any) => {
        return file.fieldname;
      }) as string[];

      const mimetypes = formData.files.map((file: any) => {
        return file.mimeType;
      }) as string[];

      console.log("IMAGES PATH", imagesBuffers);
      console.log("FIELD NAMES", fieldNames);
      console.log("MIMETYPES", mimetypes);

      await this.usecase.execute(eventId, imagesBuffers[0], mimetypes[0]);

      const viewmodel = new UploadEventBannerViewmodel(
        "A foto do event foi adicionada com sucesso!"
      );

      return new OK(viewmodel.toJSON());
    } catch (error: any) {
      if (error instanceof EntityError) {
        return new BadRequest(error.message);
      }
      if (error instanceof NoItemsFound) {
        return new NotFound(error.message);
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
