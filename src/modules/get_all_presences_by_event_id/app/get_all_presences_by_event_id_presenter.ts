import { Environments } from "src/shared/environments";
import {
  LambdaHttpRequest,
  LambdaHttpResponse,
} from "src/shared/helpers/external_interfaces/http_lambda_requests";
import { GetAllPresencesByEventIdUseCase } from "./get_all_presences_by_event_id_usecase";
import { GetAllPresencesByEventIdController } from "./get_all_presences_by_event_id_controller";
import { getRequesterUser } from "src/shared/utils/get_requester_user";

const presenceRepo = Environments.getPresenceRepo();
const eventRepo = Environments.getEventRepo();
const usecase = new GetAllPresencesByEventIdUseCase(eventRepo, presenceRepo);
const controller = new GetAllPresencesByEventIdController(usecase);

export async function getAllPresencesByEventIdPresenter(event: Record<string, any>) {  
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
    const response = await getAllPresencesByEventIdPresenter(event);
    return response;
  }