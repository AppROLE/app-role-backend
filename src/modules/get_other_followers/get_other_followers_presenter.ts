import {
    LambdaHttpRequest,
    LambdaHttpResponse,
  } from 'src/shared/helpers/external_interfaces/http_lambda_requests';
import { GetOtherFollowersUsecase } from './get_other_followers_usecase';
import { GetOtherFollowersController } from './get_other_followers_controller';
  
  const usecase = new GetOtherFollowersUsecase();
  const controller = new GetOtherFollowersController(usecase);
  
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
  