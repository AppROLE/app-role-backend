import { Environments } from "src/shared/environments";
import { LambdaHttpRequest, LambdaHttpResponse } from "src/shared/helpers/external_interfaces/http_lambda_requests";
import { GetAllFavoriteInstitutesController } from "./get_all_favorites_institutes_controller";
import { GetAllFavoriteInstitutesUseCase } from "./get_all_favorites_institutes_usecase";

const userRepo = Environments.getUserRepo();
const instituteRepo = Environments.getInstituteRepo();
const usecase = new GetAllFavoriteInstitutesUseCase(userRepo, instituteRepo);
const controller = new GetAllFavoriteInstitutesController(usecase);

export async function getAllFavoriteInstitutesPresenter(event: Record<string, any>) {
    const httpRequest = new LambdaHttpRequest(event);
    const response = await controller.handle(httpRequest);
    const httpResponse = new LambdaHttpResponse(
        response?.body,
        response?.statusCode,
        response?.headers
    );

    return httpResponse.toJSON();
}

export async function lambda_handler(event: any, context: any) {
    const response = await getAllFavoriteInstitutesPresenter(event);
    return response;
}
