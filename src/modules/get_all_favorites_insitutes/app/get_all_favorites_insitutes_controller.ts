import { IRequest } from "src/shared/helpers/external_interfaces/external_interface";
import { InternalServerError, NotFound, OK } from "src/shared/helpers/external_interfaces/http_codes";
import { NoItemsFound } from "src/shared/helpers/errors/usecase_errors";
import { MissingParameters } from "src/shared/helpers/errors/controller_errors";
import { GetAllFavoriteInstitutesUseCase } from "./get_all_favorites_insitutes_usecase";
import { GetAllFavoriteInstitutesViewModel } from "./get_all_favorites_insitutes_viewmodel";

export class GetAllFavoriteInstitutesController {
    constructor(private readonly usecase: GetAllFavoriteInstitutesUseCase) {}

    async handle(req: IRequest): Promise<any> {
        try {
            const { username } = req.data;

            if (!username) {
                throw new MissingParameters("username");
            }

            const favoriteInstitutes = await this.usecase.execute(username as string);
            const viewModel = new GetAllFavoriteInstitutesViewModel(favoriteInstitutes);
            return new OK(viewModel.toJSON());

        } catch (error: any) {
            if (error instanceof NoItemsFound) {
                return new NotFound(error.message);
            }
            return new InternalServerError(`GetAllFavoriteInstitutesController, Error on handle: ${error.message}`);
        }
    }
}
