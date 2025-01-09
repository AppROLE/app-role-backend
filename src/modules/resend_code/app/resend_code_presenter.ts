import { Environments } from 'src/shared/environments';
import {
  LambdaEvent,
  LambdaHttpRequest,
  LambdaHttpResponse,
} from 'src/shared/helpers/external_interfaces/http_lambda_requests';
import {
  ResendCodeController,
  ResendCodeRequestBody,
} from './resend_code_controller';
import { ResendCodeUseCase } from './resend_code_usecase';

const usecase = new ResendCodeUseCase();
const controller = new ResendCodeController(usecase);

export async function resendCodePresenter(
  event: LambdaEvent<ResendCodeRequestBody>
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
  const response = await resendCodePresenter(event);
  return response;
}
