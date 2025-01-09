import {
  LambdaHttpRequest,
  LambdaHttpResponse,
} from 'src/shared/helpers/external_interfaces/http_lambda_requests';
import { DeleteInstituteByIdUseCase } from './delete_institute_by_id_usecase';
import { DeleteInstituteByIdController } from './delete_institute_by_id_controller';

const usecase = new DeleteInstituteByIdUseCase();
const controller = new DeleteInstituteByIdController(usecase);

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
