import { Environments } from "src/shared/environments";
import {
  LambdaHttpRequest,
  LambdaHttpResponse,
} from "src/shared/helpers/external_interfaces/http_lambda_requests";
import { DeleteEventByIdUseCase } from "./delete_event_by_id_usecase";
import { DeleteEventByIdController } from "./delete_event_by_id_controller";

const usecase = new DeleteEventByIdUseCase();
const controller = new DeleteEventByIdController(usecase);

export async function deleteEventByIdPresenter(event: Record<string, any>) {
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
  const response = await deleteEventByIdPresenter(event);
  return response;
}
