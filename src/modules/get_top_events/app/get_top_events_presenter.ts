import {
  LambdaHttpRequest,
  LambdaHttpResponse,
} from "src/shared/helpers/external_interfaces/http_lambda_requests";
import { GetTopEventsUseCase } from "./get_top_events_usecase";
import { GetTopEventsController } from "./get_top_events_controller";

const usecase = new GetTopEventsUseCase();
const controller = new GetTopEventsController(usecase);

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
