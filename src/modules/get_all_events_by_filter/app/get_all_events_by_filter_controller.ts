import { IRequest } from "src/shared/helpers/external_interfaces/external_interface";
import { GetEventsByFilterUseCase } from "./get_all_events_by_filter_usecase";
import { GetAllEventsByFilterViewModel } from "./get_all_events_by_filter_viewmodel";
import {
  InternalServerError,
  NotFound,
  OK,
} from "src/shared/helpers/external_interfaces/http_codes";
import { NoItemsFound } from "src/shared/helpers/errors/usecase_errors";

export class GetEventsByFilterController {
  constructor(private readonly usecase: GetEventsByFilterUseCase) {}

  async handle(req: IRequest): Promise<any> {
    try {
      const filters = this.validateAndSanitizeFilters(req.data);

      const events = await this.usecase.execute(filters);

      const viewModel = new GetAllEventsByFilterViewModel(events);

      return new OK(viewModel.toJSON());
    } catch (error: any) {
      return this.handleError(error);
    }
  }

  private validateAndSanitizeFilters(filters: any): any {
    const sanitizedFilters: any = {};

    if (filters.name && typeof filters.name === "string") {
      sanitizedFilters.name = filters.name.replace(/\+/g, " ");
    }

    if (filters.price) {
      const price = Number(filters.price);
      if (!isNaN(price)) {
        sanitizedFilters.price = price;
      }
    }

    if (filters.event_date && !isNaN(new Date(filters.event_date).getTime())) {
      sanitizedFilters.event_date = filters.event_date;
    }

    if (filters.district_id) {
      sanitizedFilters.district_id = filters.district_id;
    }

    if (filters.instituteId) {
      sanitizedFilters.instituteId = filters.instituteId;
    }

    if (filters.music_type) {
      sanitizedFilters.music_type = filters.music_type;
    }

    if (filters.features) {
      sanitizedFilters.features = filters.features;
    }

    if (filters.category) {
      sanitizedFilters.category = filters.category;
    }

    return sanitizedFilters;
  }

  private handleError(error: any): any {
    if (error instanceof NoItemsFound) {
      return new NotFound(error.message);
    }

    console.error("Erro no controlador GetEventsByFilter:", error);

    return new InternalServerError(
      `GetEventsByFilterController, Error on handle: ${error.message}`
    );
  }
}
