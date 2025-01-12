import { IRequest } from 'src/shared/helpers/external_interfaces/external_interface';
import { GetAllEventsUseCase } from './get_all_events_usecase';
import { GetAllEventsViewModel } from './get_all_events_viewmodel';
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

export class GetAllEventsController {
  constructor(private readonly usecase: GetAllEventsUseCase) {}

  async handle(req: IRequest) {
    try {

      const { fromtoday, page } = req.data.query_params;

      if (fromtoday === 'true') {
        const pageNumber = Number(page);

        if (isNaN(pageNumber) || pageNumber <= 0) {
          throw new InternalServerError('Invalid page number');
        }

        const events = await this.usecase.executeFromToday(pageNumber);
        const viewModel = new GetAllEventsViewModel(events);

        return new OK(viewModel.toJSON());
      }

      const events = await this.usecase.execute();
      const viewModel = new GetAllEventsViewModel(events);
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
}
