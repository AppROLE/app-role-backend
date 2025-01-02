import { IRequest } from "src/shared/helpers/external_interfaces/external_interface";
import { GetAllPresencesByEventIdUseCase } from "./get_all_presences_by_event_id_usecase";
import {
  MissingParameters,
  WrongTypeParameters,
} from "src/shared/helpers/errors/controller_errors";
import {
  BadRequest,
  InternalServerError,
  NotFound,
  OK,
  Unauthorized,
} from "src/shared/helpers/external_interfaces/http_codes";
import { GetAllPresencesByEventIdViewmodel } from "./get_all_presences_by_event_id_viewmodel";
import { EntityError } from "src/shared/helpers/errors/domain_errors";
import {
  ForbiddenAction,
  NoItemsFound,
} from "src/shared/helpers/errors/usecase_errors";
import { UserAPIGatewayDTO } from "src/shared/infra/dto/user_api_gateway_dto";

export class GetAllPresencesByEventIdController {
  constructor(private readonly usecase: GetAllPresencesByEventIdUseCase) {}

  async handle(request: IRequest) {
    try {
      const { eventId } = request.data;

      if (!eventId) throw new MissingParameters("eventId");

      if (typeof eventId !== "string")
        throw new WrongTypeParameters("eventId", "string", typeof eventId);

      const presences = await this.usecase.execute(eventId);

      if (!presences || presences.length === 0) {
        return new OK({ message: "Nenhuma presença encontrada" });
      }

      const viewmodel = new GetAllPresencesByEventIdViewmodel(presences);

      return new OK(viewmodel.toJSON());
    } catch (error) {
      if (
        error instanceof EntityError ||
        error instanceof MissingParameters ||
        error instanceof WrongTypeParameters
      ) {
        return new BadRequest(error.message);
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
