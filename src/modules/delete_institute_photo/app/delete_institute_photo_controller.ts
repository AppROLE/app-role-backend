import {
  InternalServerError,
  OK,
} from "src/shared/helpers/external_interfaces/http_codes";
import { IRequest } from "src/shared/helpers/external_interfaces/external_interface";
import { DeleteInstitutePhotoUseCase } from "./delete_institute_photo_usecase";
import { DeleteInstitutePhotoViewModel } from "./delete_institute_photo_viewmodel";

export class DeleteInstitutePhotoController {
  constructor(private readonly usecase: DeleteInstitutePhotoUseCase) {}

  async handle(req: IRequest): Promise<any> {
    try {
      const { eventId } = req.data;
      await this.usecase.execute(eventId as string);
      const viewmodel = new DeleteInstitutePhotoViewModel(
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
