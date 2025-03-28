import {
    LambdaHttpRequest,
    LambdaHttpResponse,
  } from 'src/shared/helpers/external_interfaces/http_lambda_requests';
import { UnfavoriteInstituteUsecase } from './unfavorite_institute_usecase';
import { UnfavoriteInstituteController } from './unfavorite_institute_controller';
  
  const usecase = new UnfavoriteInstituteUsecase();
  const controller = new UnfavoriteInstituteController(usecase);
  
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