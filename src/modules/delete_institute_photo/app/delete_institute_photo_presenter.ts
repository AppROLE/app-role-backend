import { Environments } from "src/shared/environments";
import {
  LambdaHttpRequest,
  LambdaHttpResponse,
} from "src/shared/helpers/external_interfaces/http_lambda_requests";
import { DeleteInstitutePhotoUseCase } from "./delete_institute_photo_usecase";
import { DeleteInstitutePhotoController } from "./delete_institute_photo_controller";

const fileRepository = Environments.getFileRepo();
const instituteRepository = Environments.getInstituteRepo();
const usecase = new DeleteInstitutePhotoUseCase(fileRepository, instituteRepository);
const controller = new DeleteInstitutePhotoController(usecase);

export async function deleteInstitutePhotoPresenter(event: Record<string, any>) {
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
  const response = await deleteInstitutePhotoPresenter(event);
  return response;
}
