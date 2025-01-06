import {
  LambdaHttpRequest,
  LambdaHttpResponse,
} from "src/shared/helpers/external_interfaces/http_lambda_requests";
import { GetAllFavoriteInstitutesController } from "./get_all_favorites_institutes_controller";
import { GetAllFavoriteInstitutesUseCase } from "./get_all_favorites_institutes_usecase";
import { getRequesterUser } from "src/shared/utils/get_requester_user";

const usecase = new GetAllFavoriteInstitutesUseCase();
const controller = new GetAllFavoriteInstitutesController(usecase);

export async function lambda_handler(event: any, context: any) {
  const httpRequest = new LambdaHttpRequest(event);
  const requesterUser = getRequesterUser(event);
  const response = await controller.handle(httpRequest, requesterUser);
  const httpResponse = new LambdaHttpResponse(
    response?.body,
    response?.statusCode,
    response?.headers
  );

  return httpResponse.toJSON();
}
