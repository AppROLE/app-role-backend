import {
    LambdaHttpRequest,
    LambdaHttpResponse,
  } from 'src/shared/helpers/external_interfaces/http_lambda_requests';
import { GetMyFollowersUsecase } from './get_my_followers_usecase';
import { GetMyFollowersController } from './get_my_followers_controller';
  
  const usecase = new GetMyFollowersUsecase();
  const controller = new GetMyFollowersController(usecase);
  
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
  