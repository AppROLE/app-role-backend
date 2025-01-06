import {
  LambdaHttpRequest,
  LambdaHttpResponse,
} from 'src/shared/helpers/external_interfaces/http_lambda_requests';
import { GetAllEventsUseCase } from './get_all_events_usecase';
import { GetAllEventsController } from './get_all_events_controller';

const usecase = new GetAllEventsUseCase();
const controller = new GetAllEventsController(usecase);

export async function lambda_handler(event: any, context: any) {
  console.log('OK 1');
  const httpRequest = new LambdaHttpRequest(event);
  console.log('OK 2');

  await usecase.connect();

  const response = await controller.handle(httpRequest);
  console.log('OK 3');
  const httpResponse = new LambdaHttpResponse(
    response?.body,
    response?.statusCode,
    response?.headers
  );
  console.log('OK 4');

  return httpResponse.toJSON();
}
