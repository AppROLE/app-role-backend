import {
  LambdaHttpRequest,
  LambdaHttpResponse,
} from 'src/shared/helpers/external_interfaces/http_lambda_requests';
import { FavoriteInstituteUsecase } from './favorite_institute_usecase';
import { FavoriteInstituteController } from './favorite_institute_controller';

const usecase = new FavoriteInstituteUsecase();
const controller = new FavoriteInstituteController(usecase);

export async function lambda_handler(event: any, context: any) {
  const requesterUser = event.requestContext.authorizer.claims;
  const httpRequest = new LambdaHttpRequest(event);
  await usecase.connect();
  const response = await controller.handle(httpRequest, requesterUser);
  const httpResponse = new LambdaHttpResponse(
    response?.body,
    response?.statusCode,
    response?.headers
  );

  return httpResponse.toJSON();
}
