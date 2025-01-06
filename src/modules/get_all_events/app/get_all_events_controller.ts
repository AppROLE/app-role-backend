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
      const { fromtoday, page } = req.data;

      if (fromtoday === "true") {
        const pageNumber = Number(page);

        if (isNaN(pageNumber) || pageNumber <= 0) {
          throw new InternalServerError("Invalid page number");
        }

        
        const events = await this.usecase.executeFromToday(pageNumber);
        const viewModel = new GetAllEventsViewModel(events);
        
        return new OK(viewModel.toJSON());
      }
      
      console.log("teste: ", this);
      const events = await this.usecase.execute();
      const viewModel = new GetAllEventsViewModel(events);
      return new OK(viewModel.toJSON());
    } catch (error: any) {
      if (error instanceof NoItemsFound) {
        return new NotFound(error.message);
      }

      return new InternalServerError(
        `GetAllEventsController, Error on handle: ${error.message}`
      );
    } finally {
      await this.usecase.repository.closeSession();
    }
  }
}
