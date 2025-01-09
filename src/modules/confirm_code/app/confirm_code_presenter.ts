import { Environments } from 'src/shared/environments';
import {
  LambdaEvent,
  LambdaHttpRequest,
  LambdaHttpResponse,
} from 'src/shared/helpers/external_interfaces/http_lambda_requests';
import { ConfirmCodeUseCase } from './confirm_code_usecase';
import {
  ConfirmCodeController,
  ConfirmCodeRequestBody,
} from './confirm_code_controller';

const usecase = new ConfirmCodeUseCase();
const controller = new ConfirmCodeController(usecase);

export async function confirmCodePresenter(
  event: LambdaEvent<ConfirmCodeRequestBody>
) {
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
  const response = await confirmCodePresenter(event);
  return response;
}
