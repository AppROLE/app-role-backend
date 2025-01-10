import { parseMultipartFormData } from 'src/shared/helpers/functions/export_busboy';
import {
  ProfileFormDataFields,
  UpdateProfileController,
} from './update_profile_controller';
import { UpdateProfileUsecase } from './update_profile_usecase';
import { LambdaHttpResponse } from 'src/shared/helpers/external_interfaces/http_lambda_requests';

const usecase = new UpdateProfileUsecase();
const controller = new UpdateProfileController(usecase);

export async function lambda_handler(event: any) {
  const formDataParsed = await parseMultipartFormData<ProfileFormDataFields>(
    event
  );
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
