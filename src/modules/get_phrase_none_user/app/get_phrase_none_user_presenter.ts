import { Environments } from "src/shared/environments";
import {
  LambdaHttpRequest,
  LambdaHttpResponse,
} from "src/shared/helpers/external_interfaces/http_lambda_requests";
import { GetPhraseNoneUserUseCase } from "./get_phrase_none_user_usecase";
import { GetPhraseNoneUserController } from "./get_phrase_none_user_controller";

const repo = Environments.getPhraseRepo();
const usecase = new GetPhraseNoneUserUseCase(repo);
const controller = new GetPhraseNoneUserController(usecase);

export async function getPhraseNoneUserPresenter(event: Record<string, any>) {
  const httpRequest = new LambdaHttpRequest(event);
  const response = await controller.handle(httpRequest);
  const httpResponse = new LambdaHttpResponse(
    response?.body,
    response?.statusCode,
    response?.headers
  );

  return httpResponse.toJSON();
}

export async function lambda_handler(event: any, context: any) {
  const response = await getPhraseNoneUserPresenter(event);
  return response;
}
