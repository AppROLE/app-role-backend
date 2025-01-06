import {
  LambdaHttpRequest,
  LambdaHttpResponse,
} from "src/shared/helpers/external_interfaces/http_lambda_requests";
import { UpdateEventUseCase } from "./update_event_usecase";
import { UpdateEventController } from "./update_event_controller";

const usecase = new UpdateEventUseCase();
const controller = new UpdateEventController(usecase);

export async function lambda_handler(event: any, context: any) {
  const httpRequest = new LambdaHttpRequest(event);
  const response = await controller.handle(httpRequest);
  const httpResponse = new LambdaHttpResponse(
    response?.body,
    response?.statusCode,
    response?.headers
  );

  return httpResponse.toJSON();
}
