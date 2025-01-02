import {
  LambdaHttpRequest,
  LambdaHttpResponse,
} from "src/shared/helpers/external_interfaces/http_lambda_requests";
import { ConfirmEventUseCase } from "./confirm_event_usecase";
import { ConfirmEventController } from "./confirm_event_controller";
import { getRequesterUser } from "src/shared/utils/get_requester_user";

const usecase = new ConfirmEventUseCase();
const controller = new ConfirmEventController(usecase);

export async function lambda_handler(event: any, context: any) {
  const requesterUser = getRequesterUser(event);
  const httpRequest = new LambdaHttpRequest(event);
  const response = await controller.handle(httpRequest, requesterUser);
  const httpResponse = new LambdaHttpResponse(
    response?.body,
    response?.statusCode,
    response?.headers
  );

  return httpResponse.toJSON();
}
