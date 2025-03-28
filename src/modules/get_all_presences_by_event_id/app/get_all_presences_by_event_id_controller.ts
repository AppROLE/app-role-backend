import { IRequest } from 'src/shared/helpers/external_interfaces/external_interface';
import { GetAllPresencesByEventIdUseCase } from './get_all_presences_by_event_id_usecase';
import {
  ConflictItems,
  ForbiddenAction,
  MissingParameters,
  WrongTypeParameters,
} from 'src/shared/helpers/errors/errors';
import {
  BadRequest,
  Conflict,
  InternalServerError,
  NotFound,
  OK,
  Unauthorized,
} from 'src/shared/helpers/external_interfaces/http_codes';
import { EntityError } from 'src/shared/helpers/errors/errors';
import { NoItemsFound } from 'src/shared/helpers/errors/errors';
import { UserAPIGatewayDTO } from 'src/shared/infra/database/dtos/user_api_gateway_dto';

export class GetAllPresencesByEventIdController {
  constructor(private readonly usecase: GetAllPresencesByEventIdUseCase) {}

  async handle(request: IRequest, requesterUser: Record<string, any>) {
    try {
      const userApiGateway = UserAPIGatewayDTO.fromAPIGateway(requesterUser);

      if (!userApiGateway) throw new ForbiddenAction('Usuário');

      const { eventId, page } = request.data.query_params;

      if (!eventId) throw new MissingParameters('eventId');

      if (typeof eventId !== 'string')
        throw new WrongTypeParameters('eventId', 'string', typeof eventId);

      const pageNumber = Number(page);

      if (isNaN(pageNumber) || pageNumber <= 0) {
        throw new MissingParameters('Número de página inválido');
      }

      const presencesPaginated = await this.usecase.execute(
        userApiGateway.userId,
        eventId,
        pageNumber
      );

      return new OK(presencesPaginated);
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
