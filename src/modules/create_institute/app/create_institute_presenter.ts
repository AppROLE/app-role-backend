import {
  LambdaHttpRequest,
  LambdaHttpResponse,
} from "src/shared/helpers/external_interfaces/http_lambda_requests";
import { CreateInstituteUseCase } from "./create_institute_usecase";
import { CreateInstituteController } from "./create_institute_controller";

const usecase = new CreateInstituteUseCase();
const controller = new CreateInstituteController(usecase);

export async function createInstitutePresenter(event: Record<string, any>) {
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
  const response = await createInstitutePresenter(event);
  return response;
}
