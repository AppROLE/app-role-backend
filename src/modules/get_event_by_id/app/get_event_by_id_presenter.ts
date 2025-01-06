import {
  LambdaHttpRequest,
  LambdaHttpResponse,
} from "src/shared/helpers/external_interfaces/http_lambda_requests";
import { GetEventByIdUseCase } from "./get_event_by_id_usecase";
import { GetEventByIdController } from "./get_event_by_id_controller";

const usecase = new GetEventByIdUseCase();
const controller = new GetEventByIdController(usecase);

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
