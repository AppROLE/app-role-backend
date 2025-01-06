import { IRequest } from "src/shared/helpers/external_interfaces/external_interface";
import { ConfirmEventUseCase } from "./confirm_event_usecase";
import { EntityError } from "src/shared/helpers/errors/domain_errors";
import {
  MissingParameters,
  WrongTypeParameters,
} from "src/shared/helpers/errors/controller_errors";
import { UserAPIGatewayDTO } from "src/shared/infra/dto/user_api_gateway_dto";
import {
  ForbiddenAction,
  NoItemsFound,
  UserAlreadyConfirmedEvent,
} from "src/shared/helpers/errors/usecase_errors";
import { ConfirmEventViewmodel } from "./confirm_event_viewmodel";
import {
  BadRequest,
  InternalServerError,
  NotFound,
  OK,
  Unauthorized,
} from "src/shared/helpers/external_interfaces/http_codes";

export class ConfirmEventController {
  constructor(private readonly usecase: ConfirmEventUseCase) {}

  async handle(request: IRequest, requesterUser: Record<string, any>) {
    try {
      const parsedUserApiGateway =
        UserAPIGatewayDTO.fromAPIGateway(requesterUser).getParsedData();
      if (!parsedUserApiGateway) throw new ForbiddenAction("usuário");

      const { eventId, profilePhoto, promoterCode } = request.data;

      if (!eventId) throw new MissingParameters("eventId");
      if (typeof eventId !== "string")
        throw new WrongTypeParameters("eventId", "string", typeof eventId);

      if (profilePhoto && typeof profilePhoto !== "string")
        throw new WrongTypeParameters(
          "profilePhoto",
          "string",
          typeof profilePhoto
        );
      if (promoterCode && typeof promoterCode !== "string")
        throw new WrongTypeParameters(
          "promoterCode",
          "string",
          typeof promoterCode
        );

      await this.usecase.execute(
        eventId,
        parsedUserApiGateway.username,
        parsedUserApiGateway.nickname,
        profilePhoto && profilePhoto !== "" && typeof profilePhoto === "string"
          ? profilePhoto
          : undefined,
        promoterCode && promoterCode !== "" && typeof promoterCode === "string"
          ? promoterCode
          : undefined
      );

      const viewmodel = new ConfirmEventViewmodel(
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
