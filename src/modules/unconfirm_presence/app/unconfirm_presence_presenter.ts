import {
  LambdaHttpRequest,
  LambdaHttpResponse,
} from 'src/shared/helpers/external_interfaces/http_lambda_requests';
import { UnconfirmPresenceController } from './unconfirm_presence_controller';
import { UnconfirmPresenceUsecase } from './unconfirm_presence_usecase';

const usecase = new UnconfirmPresenceUsecase();
const controller = new UnconfirmPresenceController(usecase);

export async function lambda_handler(event: any, context: any) {
  const requesterUser = event.requestContext.authorizer.claims;
  const httpRequest = new LambdaHttpRequest(event);
  await usecase.connect();
  const response = await controller.handle(httpRequest, requesterUser);
  const httpResponse = new LambdaHttpResponse(
    response?.body,
    response?.statusCode,
    response?.headers
  );

  return httpResponse.toJSON();
}
