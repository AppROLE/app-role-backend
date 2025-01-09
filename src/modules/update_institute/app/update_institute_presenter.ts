import {
  LambdaEvent,
  LambdaHttpRequest,
  LambdaHttpResponse,
} from 'src/shared/helpers/external_interfaces/http_lambda_requests';
import { UpdateInstituteUseCase } from './update_institute_usecase';
import {
  UpdateInstituteController,
  UpdateInstituteRequestBody,
} from './update_institute_controller';

const usecase = new UpdateInstituteUseCase();
const controller = new UpdateInstituteController(usecase);

export async function lambda_handler(
  event: LambdaEvent<UpdateInstituteRequestBody>
) {
  const httpRequest = new LambdaHttpRequest<UpdateInstituteRequestBody>(event);
  await usecase.connect();
  const response = await controller.handle(httpRequest);
  const httpResponse = new LambdaHttpResponse(
    response?.body,
    response?.statusCode,
    response?.headers
  );

  return httpResponse.toJSON();
}
