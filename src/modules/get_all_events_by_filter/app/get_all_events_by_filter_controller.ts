import { IRequest } from 'src/shared/helpers/external_interfaces/external_interface';
import { GetEventsByFilterUseCase } from './get_all_events_by_filter_usecase';
import {
  BadRequest,
  Conflict,
  InternalServerError,
  NotFound,
  OK,
  Unauthorized,
} from 'src/shared/helpers/external_interfaces/http_codes';
import {
  ConflictItems,
  EntityError,
  ForbiddenAction,
  MissingParameters,
  NoItemsFound,
  WrongTypeParameters,
} from 'src/shared/helpers/errors/errors';
import { UserAPIGatewayDTO } from 'src/shared/infra/database/dtos/user_api_gateway_dto';

export class GetEventsByFilterController {
  constructor(private readonly usecase: GetEventsByFilterUseCase) {}

  async handle(req: IRequest, requesterUser: Record<string, any>) {
    try {
      const userApiGateway = UserAPIGatewayDTO.fromAPIGateway(requesterUser);

      if (!userApiGateway) throw new ForbiddenAction('Usuário');

      const { page, ...queryFilters } = req.data.query_params; // Removendo "page" dos filtros
      const pageNumber = Number(page);

      if (isNaN(pageNumber) || pageNumber <= 0) {
        throw new MissingParameters('Número de página inválido');
      }

      const paginatedEvents = await this.usecase.execute(
        pageNumber,
        queryFilters
      );

      return new OK(paginatedEvents);
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
