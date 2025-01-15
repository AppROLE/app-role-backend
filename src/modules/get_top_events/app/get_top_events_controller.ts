import {
  OK,
  InternalServerError,
  NotFound,
  Unauthorized,
  Conflict,
  BadRequest,
} from 'src/shared/helpers/external_interfaces/http_codes';
import { GetTopEventsUseCase } from './get_top_events_usecase';
import { IRequest } from 'src/shared/helpers/external_interfaces/external_interface';
import {
  ConflictItems,
  EntityError,
  ForbiddenAction,
  MissingParameters,
  NoItemsFound,
  WrongTypeParameters,
} from 'src/shared/helpers/errors/errors';
import { UserAPIGatewayDTO } from 'src/shared/infra/database/dtos/user_api_gateway_dto';

export class GetTopEventsController {
  constructor(private readonly usecase: GetTopEventsUseCase) {}

  async handle(req: IRequest) {
    try {
      const topEventsByDate = await this.usecase.execute();

      return new OK({
        message: 'Top eventos retornados com sucesso',
        events: topEventsByDate,
      });
    } catch (error: any) {
      if (
        error instanceof EntityError ||
        error instanceof MissingParameters ||
        error instanceof WrongTypeParameters
      ) {
        return new BadRequest(error.message);
      }
      if (error instanceof ConflictItems) {
        return new Conflict(error.message);
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
