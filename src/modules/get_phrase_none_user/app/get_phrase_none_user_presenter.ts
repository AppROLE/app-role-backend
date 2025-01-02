import {
  LambdaHttpRequest,
  LambdaHttpResponse,
} from "src/shared/helpers/external_interfaces/http_lambda_requests";
import { GetPhraseNoneUserUseCase } from "./get_phrase_none_user_usecase";
import { GetPhraseNoneUserController } from "./get_phrase_none_user_controller";

const usecase = new GetPhraseNoneUserUseCase();
const controller = new GetPhraseNoneUserController(usecase);

export async function lambda_handler(event: any, context: any) {
  const httpRequest = new LambdaHttpRequest(event);
  const response = await controller.handle(httpRequest);
  const httpResponse = new LambdaHttpResponse(
    response?.body,
    response?.statusCode,
    response?.headers
  );

  return httpResponse.toJSON();
}
