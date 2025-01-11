import {
    LambdaHttpRequest,
    LambdaHttpResponse,
  } from 'src/shared/helpers/external_interfaces/http_lambda_requests';
import { GetOtherFollowingController } from './get_other_following_controller';
import { GetOtherFollowingUsecase } from './get_other_following_usecase';
  
  const usecase = new GetOtherFollowingUsecase();
  const controller = new GetOtherFollowingController(usecase);
  
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
  