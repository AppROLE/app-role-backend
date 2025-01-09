import {
  LambdaHttpRequest,
  LambdaHttpResponse,
} from 'src/shared/helpers/external_interfaces/http_lambda_requests';
import { CreateEventUseCase } from './create_event_usecase';
import { CreateEventController } from './create_event_controller';
import { parseMultipartFormData } from 'src/shared/helpers/functions/export_busboy';

const usecase = new CreateEventUseCase();
const controller = new CreateEventController(usecase);

export async function lambda_handler(event: any, context: any) {
  const formDataParsed = await parseMultipartFormData(event);
  const requesterUser = event.requestContext.authorizer.claims;
  await usecase.connect();
  const response = await controller.handle(formDataParsed, requesterUser);
  const httpResponse = new LambdaHttpResponse(
    response?.body,
    response?.statusCode,
    response?.headers
  );

  return httpResponse.toJSON();
}
