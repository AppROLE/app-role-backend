import {
  LambdaHttpRequest,
  LambdaHttpResponse,
} from "src/shared/helpers/external_interfaces/http_lambda_requests";
import { CreateInstituteUseCase } from "./create_institute_usecase";
import { CreateInstituteController } from "./create_institute_controller";
import { parseMultipartFormData } from "src/shared/helpers/functions/export_busboy";

const usecase = new CreateInstituteUseCase();
const controller = new CreateInstituteController(usecase);

export async function lambda_handler(event: any, context: any) {
  const formDataParsed = await parseMultipartFormData(event);
  await usecase.connect();
  const response = await controller.handle(formDataParsed);
  const httpResponse = new LambdaHttpResponse(
    response?.body,
    response?.statusCode,
    response?.headers
  );

  return httpResponse.toJSON();
}
