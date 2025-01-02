import { IRequest } from "src/shared/helpers/external_interfaces/external_interface";
import { GetAllConfirmedEventsUseCase } from "./get_all_confirmed_event_usecase";
import {
  BadRequest,
  InternalServerError,
  NotFound,
  OK,
  Unauthorized,
} from "src/shared/helpers/external_interfaces/http_codes";
import { UserAPIGatewayDTO } from "src/shared/infra/dto/user_api_gateway_dto";
import {
  ForbiddenAction,
  NoItemsFound,
} from "src/shared/helpers/errors/usecase_errors";
import { EntityError } from "src/shared/helpers/errors/domain_errors";
import {
  MissingParameters,
  WrongTypeParameters,
} from "src/shared/helpers/errors/controller_errors";
import { GetAllConfirmedEventsViewModel } from "./get_all_confirmed_event_viewmodel";

export class GetAllConfirmedEventsController {
  constructor(private readonly usecase: GetAllConfirmedEventsUseCase) {}

  async handle(req: IRequest, requesterUser: Record<string, any>) {
    try {
      const parsedUserApiGateway =
        UserAPIGatewayDTO.fromAPIGateway(requesterUser).getParsedData();
      if (!parsedUserApiGateway) throw new ForbiddenAction("usuário");

      const { personUsername } = req.data;

      if (personUsername && typeof personUsername !== "string")
        throw new WrongTypeParameters(
          "personUsername",
          "string",
          typeof personUsername
        );

      let usernameToSearch =
        personUsername &&
        personUsername !== "" &&
        typeof personUsername === "string"
          ? personUsername
          : parsedUserApiGateway.username;
      let isMyEvents =
        personUsername &&
        personUsername !== "" &&
        typeof personUsername === "string"
          ? false
          : true;

      const events = await this.usecase.execute(
        usernameToSearch,
        isMyEvents,
        parsedUserApiGateway.username
      );

      const viewmodel = new GetAllConfirmedEventsViewModel(events);
      return new OK(viewmodel.toJSON());
    } catch (error: any) {
      if (
        error instanceof EntityError ||
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

      if (error instanceof Error) {
        return new InternalServerError(error.message);
      }
    } finally {
      await this.usecase.repository.closeSession();
    }
  }
}
