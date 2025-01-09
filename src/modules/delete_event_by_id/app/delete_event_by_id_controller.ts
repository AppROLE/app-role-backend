import { IRequest } from "src/shared/helpers/external_interfaces/external_interface";
import { DeleteEventByIdUseCase } from "./delete_event_by_id_usecase";
import {
  InternalServerError,
  NotFound,
  OK,
} from "src/shared/helpers/external_interfaces/http_codes";
import { NoItemsFound } from "src/shared/helpers/errors/errors";

export class DeleteEventByIdController {
  constructor(private readonly usecase: DeleteEventByIdUseCase) {}

  async handle(req: IRequest): Promise<any> {
    try {
      const { eventId } = req.data;

      await this.usecase.execute(eventId as string);

      return new OK({
        message: "Evento deletado com sucesso",
      });
    } catch (error: any) {
      if (error instanceof NoItemsFound) {
        return new NotFound(error.message);
      }
      if (error instanceof Error) {
        return new InternalServerError(
          `DeleteEventByIdController, Error on handle: ${error.message}`
        );
      }
    } finally {
      await this.usecase.repository.closeSession();
    }
  }
}
