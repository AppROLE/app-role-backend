import {
    LambdaHttpRequest,
    LambdaHttpResponse,
  } from 'src/shared/helpers/external_interfaces/http_lambda_requests';
import { ValidateUsenameController } from './validate_username_controller';
import { ValidateUsenameUsecase } from './validate_username_usecase';
  
  const usecase = new ValidateUsenameUsecase();
  const controller = new ValidateUsenameController(usecase);
  
  export async function lambda_handler(event: any, context: any) {
    const httpRequest = new LambdaHttpRequest(event);
    await usecase.connect();
    const response = await controller.handle(httpRequest);
    const httpResponse = new LambdaHttpResponse(
      response?.body,
      response?.statusCode,
      response?.headers
    );
  
    return httpResponse.toJSON();
  }
  