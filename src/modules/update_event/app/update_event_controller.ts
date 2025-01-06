import { IRequest } from "src/shared/helpers/external_interfaces/external_interface";
import { UpdateEventUseCase } from "src/modules/update_event/app/update_event_usecase";
import {
  BadRequest,
  OK,
  InternalServerError,
  NotFound,
} from "src/shared/helpers/external_interfaces/http_codes";
import { EntityError } from "src/shared/helpers/errors/domain_errors";
import {
  MissingParameters,
  WrongTypeParameters,
} from "src/shared/helpers/errors/controller_errors";
import { NoItemsFound } from "src/shared/helpers/errors/usecase_errors";
import { UpdateEventViewModel } from "./update_event_viewmodel";

export class UpdateEventController {
  constructor(private readonly usecase: UpdateEventUseCase) {}

  async handle(req: IRequest) {
    try {
      const { eventId, ...updatedFields } = req.data as {
        eventId: string;
        [key: string]: any;
      };

      if (!eventId) {
        return new BadRequest("Event ID is required");
      }

      await this.usecase.execute({
        eventId,
        ...updatedFields,
      });

      const viewmodel = new UpdateEventViewModel("ROLE atualizado com sucesso");

      return new OK(viewmodel.toJSON());
    } catch (error: any) {
      if (
        error instanceof MissingParameters ||
        error instanceof WrongTypeParameters
      ) {
        return new BadRequest(error.message);
      }
      if (error instanceof EntityError) {
        return new BadRequest(error.message);
      }
      if (error instanceof NoItemsFound) {
        return new NotFound(error.message);
      }
      return new InternalServerError(
        `CreateEventController, Error on handle: ${error.message}`
      );
    } finally {
      await this.usecase.repository.closeSession();
    }
  }
}
