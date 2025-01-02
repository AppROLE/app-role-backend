import { IRequest } from "src/shared/helpers/external_interfaces/external_interface";
import { GetPhraseUseCase } from "./get_phrase_usecase";
import {
  InternalServerError,
  NotFound,
  OK,
} from "src/shared/helpers/external_interfaces/http_codes";
import { NoItemsFound } from "src/shared/helpers/errors/usecase_errors";
import { UserAPIGatewayDTO } from "src/shared/infra/dto/user_api_gateway_dto";
import { GetPhraseViewModel } from "./get_phrase_viewmodel";

export class GetPhraseController {
  constructor(private readonly usecase: GetPhraseUseCase) {}

  async handle(
    req: IRequest,
    requesterUser: Record<string, any>
  ): Promise<any> {
    try {
      const parsedUserApiGateway =
        UserAPIGatewayDTO.fromAPIGateway(requesterUser).getParsedData();

      const phrase = await this.usecase.execute();
      const viewmodel = new GetPhraseViewModel(
        phrase.phrase,
        parsedUserApiGateway.nickname
      );

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
    } finally {
      await this.usecase.repository.closeSession();
    }
  }
}
