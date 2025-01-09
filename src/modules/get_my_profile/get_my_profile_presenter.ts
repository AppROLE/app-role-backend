import {
  LambdaHttpRequest,
  LambdaHttpResponse,
} from 'src/shared/helpers/external_interfaces/http_lambda_requests';
import { GetMyProfileUseCase } from './get_my_profile_usecase';
import { GetMyProfileController } from './get_my_profile_controller';

const usecase = new GetMyProfileUseCase();
const controller = new GetMyProfileController(usecase);

export async function lambda_handler(event: any, context: any) {
  const httpRequest = new LambdaHttpRequest(event);
  const requesterUser = event.requestContext.authorizer.claims;
  await usecase.connect();
  const response = await controller.handle(httpRequest, requesterUser);
  const httpResponse = new LambdaHttpResponse(
    response?.body,
    response?.statusCode,
    response?.headers
  );

  return httpResponse.toJSON();
}
