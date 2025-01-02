import {
  LambdaHttpRequest,
  LambdaHttpResponse,
} from "src/shared/helpers/external_interfaces/http_lambda_requests";
import { CreateEventUseCase } from "./create_event_usecase";
import { CreateEventController } from "./create_event_controller";

const usecase = new CreateEventUseCase();
const controller = new CreateEventController(usecase);

export async function createEventPresenter(event: Record<string, any>) {
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
  const response = await createEventPresenter(event);
  return response;
}
