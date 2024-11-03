import { IRequest } from "src/shared/helpers/external_interfaces/external_interface";
import { GetAllEventsUseCase } from "./get_all_events_usecase";
import { GetAllEventsViewModel } from "./get_all_events_viewmodel";
import {
  InternalServerError,
  NotFound,
  OK,
} from "src/shared/helpers/external_interfaces/http_codes";
import { NoItemsFound } from "src/shared/helpers/errors/usecase_errors";

export class GetAllEventsController {
  constructor(private readonly usecase: GetAllEventsUseCase) {}

  async handle(req: IRequest): Promise<any> {
    try {
      const { fromtoday } = req.data;

      if (fromtoday === "true") {
        const events = await this.usecase.executeFromToday();
        const viewModel = new GetAllEventsViewModel(events);
        return new OK(viewModel.toJSON());
      }

      const events = await this.usecase.execute();
      const viewModel = new GetAllEventsViewModel(events);
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
    }
  }
}
