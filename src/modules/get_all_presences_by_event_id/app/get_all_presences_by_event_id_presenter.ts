import {
  LambdaHttpRequest,
  LambdaHttpResponse,
} from "src/shared/helpers/external_interfaces/http_lambda_requests";
import { GetAllPresencesByEventIdUseCase } from "./get_all_presences_by_event_id_usecase";
import { GetAllPresencesByEventIdController } from "./get_all_presences_by_event_id_controller";

const usecase = new GetAllPresencesByEventIdUseCase();
const controller = new GetAllPresencesByEventIdController(usecase);

export async function lambda_handler(event: any, context: any) {
  const httpRequest = new LambdaHttpRequest(event);
  await usecase.connect();
  const response = await controller.handle(httpRequest);
  const httpResponse = new LambdaHttpResponse(
    response?.body,
    response?.statusCode,
    response?.headers
  );

  return httpResponse.toJSON();
}
