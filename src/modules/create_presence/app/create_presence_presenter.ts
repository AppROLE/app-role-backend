import {
  LambdaHttpRequest,
  LambdaHttpResponse,
} from 'src/shared/helpers/external_interfaces/http_lambda_requests';
import { CreatePresenceUsecase } from './create_presence_usecase';
import { CreatePresenceController } from './create_presence_controller';

const usecase = new CreatePresenceUsecase();
const controller = new CreatePresenceController(usecase);

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
