import {
  LambdaHttpRequest,
  LambdaHttpResponse,
} from 'src/shared/helpers/external_interfaces/http_lambda_requests';
import { UpdateEventUsecase } from './update_event_usecase';
import { UpdateEventController } from './update_event_controller';
import { parseMultipartFormData } from 'src/shared/helpers/functions/export_busboy';

const usecase = new UpdateEventUsecase();
const controller = new UpdateEventController(usecase);

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
