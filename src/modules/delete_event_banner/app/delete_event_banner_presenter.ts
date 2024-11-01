import { Environments } from "src/shared/environments";
import {
  LambdaHttpRequest,
  LambdaHttpResponse,
} from "src/shared/helpers/external_interfaces/http_lambda_requests";
import { DeleteEventBannerUseCase } from "./delete_event_banner_usecase";
import { DeleteEventBannerController } from "./delete_event_banner_controller";

const eventRepository = Environments.getEventRepo();
const fileRepository = Environments.getFileRepo();
const usecase = new DeleteEventBannerUseCase(eventRepository, fileRepository);
const controller = new DeleteEventBannerController(usecase);

export async function DeleteEventBannerPresenter(event: Record<string, any>) {
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
  const response = await DeleteEventBannerPresenter(event);
  return response;
}
