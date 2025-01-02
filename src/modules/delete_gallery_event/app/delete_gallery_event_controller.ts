import { MissingParameters } from "src/shared/helpers/errors/controller_errors";
import {
  BadRequest,
  InternalServerError,
  NotFound,
  OK,
} from "src/shared/helpers/external_interfaces/http_codes";
import { EntityError } from "src/shared/helpers/errors/domain_errors";
import {
  FailedToAddToGallery,
  galleryEmpty,
  NoItemsFound,
} from "src/shared/helpers/errors/usecase_errors";
import { IRequest } from "src/shared/helpers/external_interfaces/external_interface";
import { DeleteGalleryEventUseCase } from "./delete_gallery_event_usecase";
import { DeleteGalleryEventViewModel } from "./delete_gallery_event_viewmodel";

export class DeleteGalleryEventController {
  constructor(private readonly usecase: DeleteGalleryEventUseCase) {}

  async handle(request: IRequest) {
    try {
      const eventId = request.data.eventId;

      if (!eventId) {
        throw new MissingParameters("eventId");
      }

      await this.usecase.execute(eventId as unknown as string);

      const viewmodel = new DeleteGalleryEventViewModel(
        "A galeria foi deletada com sucesso"
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
      if (error instanceof galleryEmpty) {
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
