import { Environments } from "src/shared/environments";
import {
  LambdaHttpRequest,
  LambdaHttpResponse,
} from "src/shared/helpers/external_interfaces/http_lambda_requests";
import { GetAllInstitutesUseCase } from "./get_all_institutes_usecase";
import { GetAllInstitutesController } from "./get_all_institutes_controller";

const repo = Environments.getInstituteRepo();
const usecase = new GetAllInstitutesUseCase(repo);
const controller = new GetAllInstitutesController(usecase);

export async function getAllInstitutesPresenter(event: Record<string, any>) {
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
  const response = await getAllInstitutesPresenter(event);
  return response;
}
