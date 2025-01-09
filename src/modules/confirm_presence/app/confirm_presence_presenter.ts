import {
  LambdaHttpRequest,
  LambdaHttpResponse,
} from "src/shared/helpers/external_interfaces/http_lambda_requests";
import { ConfirmPresenceUsecase } from "./confirm_presence_usecase";
import { ConfirmPresenceController } from "./confirm_presence_controller";
import { getRequesterUser } from "src/shared/utils/get_requester_user";

const usecase = new ConfirmPresenceUsecase();
const controller = new ConfirmPresenceController(usecase);

export async function lambda_handler(event: any, context: any) {
  const requesterUser = getRequesterUser(event);
  const httpRequest = new LambdaHttpRequest(event);
  await usecase.connect();
  const response = await controller.handle(httpRequest, requesterUser);
  const httpResponse = new LambdaHttpResponse(
    response?.body,
    response?.statusCode,
    response?.headers
  );

  return httpResponse.toJSON();
}
