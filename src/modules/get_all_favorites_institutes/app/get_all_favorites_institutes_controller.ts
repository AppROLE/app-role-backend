import { IRequest } from "src/shared/helpers/external_interfaces/external_interface";
import {
  InternalServerError,
  NotFound,
  OK,
} from "src/shared/helpers/external_interfaces/http_codes";
import {
  ForbiddenAction,
  NoItemsFound,
} from "src/shared/helpers/errors/usecase_errors";
import { MissingParameters } from "src/shared/helpers/errors/controller_errors";
import { GetAllFavoriteInstitutesUseCase } from "./get_all_favorites_institutes_usecase";
import { GetAllFavoriteInstitutesViewModel } from "./get_all_favorites_institutes_viewmodel";
import { UserAPIGatewayDTO } from "src/shared/infra/dto/user_api_gateway_dto";

export class GetAllFavoriteInstitutesController {
  constructor(private readonly usecase: GetAllFavoriteInstitutesUseCase) {}

  async handle(
    req: IRequest,
    requesterUser: Record<string, any>
  ): Promise<any> {
    try {
      const parsedUserApiGateway =
        UserAPIGatewayDTO.fromAPIGateway(requesterUser).getParsedData();
      if (!parsedUserApiGateway) throw new ForbiddenAction("usuário");

      console.log(
        "Handling request in GetAllFavoriteInstitutesController with data:",
        req.data
      );
      const username = parsedUserApiGateway.username;

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
