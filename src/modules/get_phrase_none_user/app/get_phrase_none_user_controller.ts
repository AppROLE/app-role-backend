import { IRequest } from "src/shared/helpers/external_interfaces/external_interface";
import { GetPhraseNoneUserUseCase } from "./get_phrase_none_user_usecase";
import {
  InternalServerError,
  NotFound,
  OK,
} from "src/shared/helpers/external_interfaces/http_codes";
import { NoItemsFound } from "src/shared/helpers/errors/usecase_errors";
import { GetPhraseNoneUserViewModel } from "./get_phrase_none_user_viewmodel";

export class GetPhraseNoneUserController {
  constructor(private readonly usecase: GetPhraseNoneUserUseCase) {}

  async handle(
    req: IRequest
  ): Promise<any> {
    try {
      const nickname = '';
      const phrase = await this.usecase.execute();
      const viewmodel = new GetPhraseNoneUserViewModel(phrase.phrase, nickname);

      return new OK(viewmodel.toJSON());
    } catch (error: any) {
      if (error instanceof NoItemsFound) {
        return new NotFound(error.message);
      }
      if (error instanceof Error) {
        return new InternalServerError(
          `CreateEventController, Error on handle: ${error.message}`
        );
      }
    }
  }
}
