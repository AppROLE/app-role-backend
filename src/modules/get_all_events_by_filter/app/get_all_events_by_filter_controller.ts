import { IRequest } from 'src/shared/helpers/external_interfaces/external_interface';
import { GetEventsByFilterUseCase } from './get_all_events_by_filter_usecase';
import { GetAllEventsByFilterViewModel } from './get_all_events_by_filter_viewmodel';
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

      const filters = this.validateAndSanitizeFilters(req.data.query_params);

      const events = await this.usecase.execute(filters);

      const viewModel = new GetAllEventsByFilterViewModel(events);

      return new OK(viewModel.toJSON());
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

  private validateAndSanitizeFilters(filters: any): any {
    const sanitizedFilters: any = {};

    if (filters.name && typeof filters.name === 'string') {
      sanitizedFilters.name = filters.name.replace(/\+/g, ' ');
    }

    if (filters.price) {
      const price = Number(filters.price);
      if (!isNaN(price)) {
        sanitizedFilters.price = price;
      }
    }

    if (filters.eventDate && !isNaN(new Date(filters.eventDate).getTime())) {
      sanitizedFilters.eventDate = filters.eventDate;
    }

    if (filters.instituteId) {
      sanitizedFilters.instituteId = filters.instituteId;
    }

    if (filters.musicType) {
      sanitizedFilters.musicType = filters.musicType;
    }

    if (filters.features) {
      sanitizedFilters.features = filters.features;
    }

    if (filters.category) {
      sanitizedFilters.category = filters.category;
    }

    return sanitizedFilters;
  }
}
