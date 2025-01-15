import {
  LambdaEvent,
  LambdaHttpRequest,
  LambdaHttpResponse,
} from 'src/shared/helpers/external_interfaces/http_lambda_requests';
import { GetInstituteUsecase } from './get_institute_usecase';
import {
  GetInstituteController,
  GetInstituteByIdRequestBody,
} from './get_institute_controller';

const usecase = new GetInstituteUsecase();
const controller = new GetInstituteController(usecase);

export async function lambda_handler(
  event: LambdaEvent<GetInstituteByIdRequestBody>,
  context: any
) {
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
