import {
    LambdaHttpRequest,
    LambdaHttpResponse,
  } from 'src/shared/helpers/external_interfaces/http_lambda_requests';
import { GetMyFollowingController } from './get_my_following_controller';
import { GetMyFollowingUseCase } from './get_my_following_usecase';
  
  const usecase = new GetMyFollowingUseCase();
  const controller = new GetMyFollowingController(usecase);
  
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
  