import {
  LambdaHttpRequest,
  LambdaHttpResponse,
} from 'src/shared/helpers/external_interfaces/http_lambda_requests';
import { GetAllInstitutesUseCase } from './get_all_institutes_usecase';
import { GetAllInstitutesController } from './get_all_institutes_controller';

const usecase = new GetAllInstitutesUseCase();
const controller = new GetAllInstitutesController(usecase);

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
