import { IRequest } from "src/shared/helpers/external_interfaces/external_interface";
import {
  InternalServerError,
  NotFound,
  OK,
} from "src/shared/helpers/external_interfaces/http_codes";
import { NoItemsFound } from "src/shared/helpers/errors/usecase_errors";
import { MissingParameters } from "src/shared/helpers/errors/controller_errors";
import { GetAllFavoriteInstitutesUseCase } from "./get_all_favorites_institutes_usecase";
import { GetAllFavoriteInstitutesViewModel } from "./get_all_favorites_institutes_viewmodel";

export class GetAllFavoriteInstitutesController {
  constructor(private readonly usecase: GetAllFavoriteInstitutesUseCase) {}

  async handle(req: IRequest): Promise<any> {
    try {
      console.log(
        "Handling request in GetAllFavoriteInstitutesController with data:",
        req.data
      );
      const { username } = req.data;

      if (!username) {
        console.log("Missing username parameter in request.");
        throw new MissingParameters("username");
      }

      console.log("Executing use case with username:", username);
      const favoriteInstitutes = await this.usecase.execute(username as string);

      console.log("Use case executed successfully, creating view model.");
      const viewModel = new GetAllFavoriteInstitutesViewModel(
        favoriteInstitutes
      );

      console.log(
        "Returning response with view model data:",
        viewModel.toJSON()
      );
      return new OK(viewModel.toJSON());
    } catch (error: any) {
      if (error instanceof NoItemsFound) {
        console.log("NoItemsFound error in controller:", error);
        return new NotFound(error.message);
      }
      console.log(
        "Unexpected error in GetAllFavoriteInstitutesController:",
        error
      );
      return new InternalServerError(
        `GetAllFavoriteInstitutesController, Error on handle: ${error.message}`
      );
    }
  }
}
