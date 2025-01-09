import {
  LambdaHttpRequest,
  LambdaHttpResponse,
} from 'src/shared/helpers/external_interfaces/http_lambda_requests';
import { GetOtherProfileUseCase } from './get_other_profile_usecase';
import { GetOtherProfileController } from './get_other_profile_controller';
import { getRequesterUser } from 'src/shared/utils/get_requester_user';

const usecase = new GetOtherProfileUseCase();
const controller = new GetOtherProfileController(usecase);

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
