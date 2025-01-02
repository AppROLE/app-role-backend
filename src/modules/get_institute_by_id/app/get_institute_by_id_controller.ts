import { IRequest } from "src/shared/helpers/external_interfaces/external_interface";
import { GetInstituteByIdUseCase } from "./get_institute_by_id_usecase";
import {
  InternalServerError,
  NotFound,
  OK,
} from "src/shared/helpers/external_interfaces/http_codes";
import { NoItemsFound } from "src/shared/helpers/errors/usecase_errors";
import { MissingParameters } from "src/shared/helpers/errors/controller_errors";
import { GetInstituteByIdViewModel } from "./get_institute_by_id_viewmodel";

export class GetInstituteByIdController {
  constructor(private readonly usecase: GetInstituteByIdUseCase) {}

  async handle(req: IRequest): Promise<any> {
    try {
      const { instituteId } = req.data;

      if (instituteId == undefined) {
        throw new MissingParameters("instituteId");
      }
      const institute = await this.usecase.execute(instituteId as string);
      console.log(institute);
      const viewModel = new GetInstituteByIdViewModel(institute);
      return new OK(viewModel.toJSON());
    } catch (error: any) {
      if (error instanceof NoItemsFound) {
        return new NotFound(error.message);
      }
      if (error instanceof Error) {
        return new InternalServerError(
          `GetInstituteByIdController, Error on handle: ${error.message}`
        );
      }
    } finally {
      await this.usecase.repository.closeSession();
    }
  }
}
