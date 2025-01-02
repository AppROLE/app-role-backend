import { Environments } from "src/shared/environments";
import {
  LambdaHttpRequest,
  LambdaHttpResponse,
} from "src/shared/helpers/external_interfaces/http_lambda_requests";
import { DeleteGalleryEventUseCase } from "./delete_gallery_event_usecase";
import { DeleteGalleryEventController } from "./delete_gallery_event_controller";

const usecase = new DeleteGalleryEventUseCase();
const controller = new DeleteGalleryEventController(usecase);

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
