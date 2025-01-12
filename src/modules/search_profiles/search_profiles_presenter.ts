import {
    LambdaHttpRequest,
    LambdaHttpResponse,
  } from 'src/shared/helpers/external_interfaces/http_lambda_requests';
import { SearchProfilesController } from './search_profiles_controller';
import { SearchProfilesUsecase } from './search_profiles_usecase';
  
  const usecase = new SearchProfilesUsecase();
  const controller = new SearchProfilesController(usecase);
  
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
  