import { IRequest } from "src/shared/helpers/external_interfaces/external_interface";
import { UnConfirmEventUseCase } from "./unconfirm_event_usecase";
import { UserAPIGatewayDTO } from "src/shared/infra/database/dtos/user_api_gateway_dto";
import {
  ForbiddenAction,
  NoItemsFound,
} from "src/shared/helpers/errors/errors";
import {
  MissingParameters,
  WrongTypeParameters,
} from "src/shared/helpers/errors/errors";
import { UnConfirmEventViewmodel } from "./unconfirm_event_viewmodel";
import {
  BadRequest,
  InternalServerError,
  NotFound,
  OK,
  Unauthorized,
} from "src/shared/helpers/external_interfaces/http_codes";

export class UnConfirmEventController {
  constructor(private readonly usecase: UnConfirmEventUseCase) {}

  async handle(request: IRequest, requesterUser: Record<string, any>) {
    try {
      const parsedUserApiGateway =
        UserAPIGatewayDTO.fromAPIGateway(requesterUser).getParsedData();
      if (!parsedUserApiGateway) throw new ForbiddenAction("usuário");

      const { eventId } = request.data;

      if (!eventId) throw new MissingParameters("eventId");
      if (typeof eventId !== "string")
        throw new WrongTypeParameters("eventId", "string", typeof eventId);

      await this.usecase.execute(eventId, parsedUserApiGateway.username);

      const viewmodel = new UnConfirmEventViewmodel(
        "Presença desconfirmada com sucesso"
      );

      return new OK(viewmodel.toJSON());
    } catch (error: any) {
      if (
        error instanceof MissingParameters ||
        error instanceof WrongTypeParameters
      ) {
        return new BadRequest(error.message);
      }

      if (error instanceof ForbiddenAction) {
        return new Unauthorized(error.message);
      }

      if (error instanceof NoItemsFound) {
        return new NotFound(error.message);
      }

      return new InternalServerError("Erro interno no servidor");
    } finally {
      await this.usecase.repository.closeSession();
    }
  }
}
