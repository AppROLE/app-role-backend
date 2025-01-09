import {
  LambdaEvent,
  LambdaHttpRequest,
  LambdaHttpResponse,
} from 'src/shared/helpers/external_interfaces/http_lambda_requests';
import { GetInstituteByIdUseCase } from './get_institute_by_id_usecase';
import {
  GetInstituteByIdController,
  GetInstituteByIdRequestBody,
} from './get_institute_by_id_controller';

const usecase = new GetInstituteByIdUseCase();
const controller = new GetInstituteByIdController(usecase);

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
