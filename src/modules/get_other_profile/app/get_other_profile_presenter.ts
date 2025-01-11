import {
  LambdaHttpRequest,
  LambdaHttpResponse,
} from 'src/shared/helpers/external_interfaces/http_lambda_requests';
import { GetOtherProfileUseCase } from './get_other_profile_usecase';
import { GetOtherProfileController } from './get_other_profile_controller';

const usecase = new GetOtherProfileUseCase();
const controller = new GetOtherProfileController(usecase);

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
