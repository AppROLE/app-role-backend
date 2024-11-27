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

  async handle(req: IRequest, requesterUser: Record<string, any> = {}): Promise<any> {
    try {
      let nickname = '';
  
      if (requesterUser && requesterUser.claims) {
        try {
          const parsedUserApiGateway = UserAPIGatewayDTO.fromAPIGateway(requesterUser.claims).getParsedData();
          if (parsedUserApiGateway && parsedUserApiGateway.nickname) {
            nickname = parsedUserApiGateway.nickname;
          }
        } catch (error: any) {
          console.warn("Erro ao parsear o usuário do token:", error.message);
          nickname = '';
        }
      }
  
      const phrase = await this.usecase.execute();
  
      const viewmodel = new GetPhraseViewModel(phrase.phrase, nickname);
  
      return new OK(viewmodel.toJSON());
    } catch (error: any) {
      if (error instanceof NoItemsFound) {
        return new NotFound(error.message);
      }
      if (error instanceof Error) {
        return new InternalServerError(
          `GetPhraseController, Error on handle: ${error.message}`
        );
      }
    }
  }
}
