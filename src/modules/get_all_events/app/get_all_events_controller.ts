import { IRequest } from 'src/shared/helpers/external_interfaces/external_interface';
import { GetAllEventsUseCase } from './get_all_events_usecase';
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

export class GetAllEventsController {
  constructor(private readonly usecase: GetAllEventsUseCase) {}

  async handle(req: IRequest) {
    try {
      const { fromToday, page } = req.data.query_params;

      const pageNumber = Number(page);

      if (isNaN(pageNumber) || pageNumber <= 0) {
        throw new MissingParameters('Número de página inválido');
      }

      if (fromToday === 'true') {
        const paginatedEvents = await this.usecase.executeFromToday(pageNumber);

        return new OK(paginatedEvents);
      }

      const paginatedEvents = await this.usecase.execute(pageNumber);
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
