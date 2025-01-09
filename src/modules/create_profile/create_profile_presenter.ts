import { parseMultipartFormData } from 'src/shared/helpers/functions/export_busboy';
import { CreateProfileController } from './create_profile_controller';
import { CreateProfileUsecase } from './create_profile_usecase';
import { LambdaHttpResponse } from 'src/shared/helpers/external_interfaces/http_lambda_requests';

const usecase = new CreateProfileUsecase();
const controller = new CreateProfileController(usecase);

export async function lambda_handler(event: any) {
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
