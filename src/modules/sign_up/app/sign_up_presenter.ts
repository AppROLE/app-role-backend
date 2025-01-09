import { Environments } from 'src/shared/environments';
import {
  LambdaEvent,
  LambdaHttpRequest,
  LambdaHttpResponse,
} from 'src/shared/helpers/external_interfaces/http_lambda_requests';
import { SignUpController, SignUpRequestBody } from './sign_up_controller';
import { SignUpUseCase } from './sign_up_usecase';

const usecase = new SignUpUseCase();
const controller = new SignUpController(usecase);

export async function signUpPresenter(event: LambdaEvent<SignUpRequestBody>) {
  const httpRequest = new LambdaHttpRequest<SignUpRequestBody>(event);
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
  const response = await signUpPresenter(event);
  return response;
}
