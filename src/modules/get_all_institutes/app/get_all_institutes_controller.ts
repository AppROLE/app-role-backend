import { IRequest } from "src/shared/helpers/external_interfaces/external_interface";
import {
  InternalServerError,
  NotFound,
  OK,
} from "src/shared/helpers/external_interfaces/http_codes";
import { NoItemsFound } from "src/shared/helpers/errors/errors";
import { GetAllInstitutesUseCase } from "./get_all_institutes_usecase";
import { GetAllInstitutesViewModel } from "./get_all_institutes_viewmodel";

export class GetAllInstitutesController {
  constructor(private readonly usecase: GetAllInstitutesUseCase) {}

  async handle(req: IRequest): Promise<any> {
    try {
      const institutes = await this.usecase.execute();
      const viewModel = new GetAllInstitutesViewModel(institutes);
      return new OK(viewModel.toJSON());
    } catch (error: any) {
      if (error instanceof NoItemsFound) {
        return new NotFound(error.message);
      }
      if (error instanceof Error) {
        return new InternalServerError(
          `getAllInstitutesController, Error on handle: ${error.message}`
        );
      }
    } finally {
      await this.usecase.repository.closeSession();
    }
  }
}
