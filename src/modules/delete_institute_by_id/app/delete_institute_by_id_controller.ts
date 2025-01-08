import { IRequest } from "src/shared/helpers/external_interfaces/external_interface";
import {
  InternalServerError,
  NotFound,
  OK,
} from "src/shared/helpers/external_interfaces/http_codes";
import { NoItemsFound } from "src/shared/helpers/errors/errors";
import { DeleteInstituteByIdViewModel } from "./delete_institute_by_id_viewmodel";
import { DeleteInstituteByIdUseCase } from "./delete_institute_by_id_usecase";

export class DeleteInstituteByIdController {
  constructor(private readonly usecase: DeleteInstituteByIdUseCase) {}

  async handle(req: IRequest): Promise<any> {
    try {
      const { instituteId } = req.data;
      await this.usecase.execute(instituteId as string);
      const viewmodel = new DeleteInstituteByIdViewModel(
        "Instituto deletado com sucesso"
      );
      return new OK(viewmodel.toJSON());
    } catch (error: any) {
      if (error instanceof NoItemsFound) {
        return new NotFound(error.message);
      }
      if (error instanceof Error) {
        return new InternalServerError(
          `DeleteInstituteByIdController, Error on handle: ${error.message}`
        );
      }
    } finally {
      await this.usecase.repository.closeSession();
    }
  }
}
