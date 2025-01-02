import {
  InternalServerError,
  OK,
} from "src/shared/helpers/external_interfaces/http_codes";
import { IRequest } from "src/shared/helpers/external_interfaces/external_interface";
import { DeleteEventPhotoUseCase } from "./delete_event_photo_usecase";
import { DeleteEventPhotoViewModel } from "./delete_event_photo_viewmodel";

export class deleteEventPhotoController {
  constructor(private readonly usecase: DeleteEventPhotoUseCase) {}

  async handle(req: IRequest): Promise<any> {
    try {
      const { eventId } = req.data;
      await this.usecase.execute(eventId as string);
      const viewmodel = new DeleteEventPhotoViewModel(
        "Foto do evento deletada com sucesso"
      );
      return new OK(viewmodel.toJSON());
    } catch (error: any) {
      if (error instanceof Error) {
        return new InternalServerError(
          `DeleteEventPhotoController, Error on handle: ${error.message}`
        );
      }
    } finally {
      await this.usecase.repository.closeSession();
    }
  }
}
