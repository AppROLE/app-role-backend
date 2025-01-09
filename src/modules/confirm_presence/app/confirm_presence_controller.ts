import { IRequest } from "src/shared/helpers/external_interfaces/external_interface";
import { ConfirmPresenceUsecase } from "./confirm_presence_usecase";
import { EntityError } from "src/shared/helpers/errors/errors";
import {
  MissingParameters,
  WrongTypeParameters,
} from "src/shared/helpers/errors/errors";
import { UserAPIGatewayDTO } from "src/shared/infra/database/dtos/user_api_gateway_dto";
import {
  ForbiddenAction,
  NoItemsFound,
  UserAlreadyConfirmedEvent,
} from "src/shared/helpers/errors/errors";
import { ConfirmPresenceViewmodel } from "./confirm_presence_viewmodel";
import {
  BadRequest,
  InternalServerError,
  NotFound,
  OK,
  Unauthorized,
} from "src/shared/helpers/external_interfaces/http_codes";

interface ConfirmPresenceData {
  eventId: string;
  promoterCode?: string;
}

export class ConfirmPresenceController {
  constructor(private readonly usecase: ConfirmPresenceUsecase) {}

  async handle(request: IRequest, requesterUser: Record<string, any>) {
    try {
      const parsedUserApiGateway =
        UserAPIGatewayDTO.fromAPIGateway(requesterUser).getParsedData();
      if (!parsedUserApiGateway) throw new ForbiddenAction("usuário");

      const { eventId, promoterCode } =
        request.data as unknown as ConfirmPresenceData;

      if (!eventId) throw new MissingParameters("eventId");
      if (typeof eventId !== "string")
        throw new WrongTypeParameters("eventId", "string", typeof eventId);

      if (promoterCode && typeof promoterCode !== "string")
        throw new WrongTypeParameters(
          "promoterCode",
          "string",
          typeof promoterCode
        );

      await this.usecase.execute(
        eventId,
        parsedUserApiGateway.userId,
        promoterCode
      );

      const viewmodel = new ConfirmPresenceViewmodel(
        "Presença confirmada com sucesso"
      );

      return new OK(viewmodel.toJSON());
    } catch (error: any) {
      if (
        error instanceof EntityError ||
        error instanceof MissingParameters ||
        error instanceof WrongTypeParameters
      ) {
        return new BadRequest(error.message);
      }

      if (error instanceof UserAlreadyConfirmedEvent) {
        return new BadRequest(error.message);
      }

      if (error instanceof ForbiddenAction) {
        return new Unauthorized(error.message);
      }

      if (error instanceof NoItemsFound) {
        return new NotFound(error.message);
      }

      if (error instanceof Error) {
        return new InternalServerError(error.message);
      }
    } finally {
      await this.usecase.repository.closeSession();
    }
  }
}
