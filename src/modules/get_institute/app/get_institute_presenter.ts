import {
  LambdaEvent,
  LambdaHttpRequest,
  LambdaHttpResponse,
} from 'src/shared/helpers/external_interfaces/http_lambda_requests';
import { GetInstituteUsecase } from './get_institute_usecase';
import {
  GetInstituteController,
  GetInstituteByIdRequestBody,
} from './get_institute_controller';

const usecase = new GetInstituteUsecase();
const controller = new GetInstituteController(usecase);

export async function lambda_handler(
  event: LambdaEvent<GetInstituteByIdRequestBody>,
  context: any
) {
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
