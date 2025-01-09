import { Environments } from 'src/shared/environments';
import {
  LambdaEvent,
  LambdaHttpRequest,
  LambdaHttpResponse,
} from 'src/shared/helpers/external_interfaces/http_lambda_requests';
import { VerifyEmailUsecase } from './verify_email_usecase';
import {
  VerifyEmailController,
  ConfirmCodeRequestBody,
} from './verify_email_controller';

const usecase = new VerifyEmailUsecase();
const controller = new VerifyEmailController(usecase);

export async function confirmCodePresenter(
  event: LambdaEvent<ConfirmCodeRequestBody>
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

export async function lambda_handler(event: any, context: any) {
  const response = await confirmCodePresenter(event);
  return response;
}
