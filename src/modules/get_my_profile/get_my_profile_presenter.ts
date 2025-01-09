import {
  LambdaHttpRequest,
  LambdaHttpResponse,
} from 'src/shared/helpers/external_interfaces/http_lambda_requests';
import { getRequesterUser } from 'src/shared/utils/get_requester_user';
import { GetMyProfileUseCase } from './get_my_profile_usecase';
import { GetMyProfileController } from './get_my_profile_controller';

const usecase = new GetMyProfileUseCase();
const controller = new GetMyProfileController(usecase);

export async function lambda_handler(event: any, context: any) {
  const requesterUser = getRequesterUser(event);
  const httpRequest = new LambdaHttpRequest(event);
  const response = await controller.handle(httpRequest, requesterUser);
  const httpResponse = new LambdaHttpResponse(
    response?.body,
    response?.statusCode,
    response?.headers
  );

  return httpResponse.toJSON();
}
