import {
  OK,
  InternalServerError,
  NotFound,
} from "src/shared/helpers/external_interfaces/http_codes";
import { GetTopEventsUseCase } from "./get_top_events_usecase";
import { IRequest } from "src/shared/helpers/external_interfaces/external_interface";
import { NoItemsFound } from "src/shared/helpers/errors/usecase_errors";

export class GetTopEventsController {
  constructor(private readonly usecase: GetTopEventsUseCase) {}

  async handle(req: IRequest): Promise<any> {
    try {
      const topEventsByDate = await this.usecase.execute();

      return new OK({
        message: "Top events retrieved successfully",
        data: topEventsByDate,
      });
    } catch (error: any) {
      if (error instanceof NoItemsFound) {
        return new NotFound(error.message);
      }
      if (error instanceof Error) {
        return new InternalServerError(
          `GetTopEventController, Error on handle: ${error.message}`
        );
      }
    } finally {
      await this.usecase.repository.closeSession();
    }
  }
}
