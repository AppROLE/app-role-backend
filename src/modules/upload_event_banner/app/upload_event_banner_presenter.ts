import {
  LambdaHttpRequest,
  LambdaHttpResponse,
} from "src/shared/helpers/external_interfaces/http_lambda_requests";
import { parseMultipartFormData } from "src/shared/helpers/functions/export_busboy";
import { UploadEventBannerController } from "./upload_event_banner_controller";
import { UploadEventBannerUseCase } from "./upload_event_banner_usecase";

const usecase = new UploadEventBannerUseCase();
const controller = new UploadEventBannerController(usecase);

export async function lambda_handler(event: any, context: any) {
  const formDataParsed = await parseMultipartFormData(event);
  const httpRequest = new LambdaHttpRequest(event);
  const response = await controller.handle(httpRequest, formDataParsed);
  const httpResponse = new LambdaHttpResponse(
    response?.body,
    response?.statusCode,
    response?.headers
  );

  return httpResponse.toJSON();
}
