import {
  LambdaHttpRequest,
  LambdaHttpResponse,
} from "src/shared/helpers/external_interfaces/http_lambda_requests";
import { UnConfirmEventController } from "./unconfirm_event_controller";
import { UnConfirmEventUseCase } from "./unconfirm_event_usecase";
import { getRequesterUser } from "src/shared/utils/get_requester_user";

const usecase = new UnConfirmEventUseCase();
const controller = new UnConfirmEventController(usecase);

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
