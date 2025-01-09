import {
  LambdaHttpRequest,
  LambdaHttpResponse,
} from 'src/shared/helpers/external_interfaces/http_lambda_requests';
import { ConfirmForgotPasswordUseCase } from './confirm_forgot_password_usecase';
import { ConfirmForgotPasswordController } from './confirm_forgot_password_controller';

const usecase = new ConfirmForgotPasswordUseCase();
const controller = new ConfirmForgotPasswordController(usecase);

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
