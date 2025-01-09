import {
  LambdaHttpRequest,
  LambdaHttpResponse,
} from 'src/shared/helpers/external_interfaces/http_lambda_requests';
import { GetAllEventsUseCase } from './get_all_events_usecase';
import { GetAllEventsController } from './get_all_events_controller';

const usecase = new GetAllEventsUseCase();
const controller = new GetAllEventsController(usecase);

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
