import { IRequest } from 'src/shared/helpers/external_interfaces/external_interface';
import { GetEventByIdViewModel } from './get_event_by_id_viewmodel';
import { GetEventByIdUseCase } from './get_event_by_id_usecase';
import {
  InternalServerError,
  NotFound,
  OK,
} from 'src/shared/helpers/external_interfaces/http_codes';
import { NoItemsFound } from 'src/shared/helpers/errors/errors';

export class GetEventByIdController {
  constructor(private readonly usecase: GetEventByIdUseCase) {}

  async handle(req: IRequest): Promise<any> {
    try {
      const { eventId } = req.data.body;
      const event = await this.usecase.execute(eventId as string);
      const viewModel = new GetEventByIdViewModel(event);
      return new OK(viewModel.toJSON());
    } catch (error: any) {
      if (error instanceof NoItemsFound) {
        return new NotFound(error.message);
      }
      if (error instanceof Error) {
        return new InternalServerError(
          `CreateEventController, Error on handle: ${error.message}`
        );
      }
    } finally {
      await this.usecase.repository.closeSession();
    }
  }
}
