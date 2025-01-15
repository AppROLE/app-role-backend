import { IRequest } from 'src/shared/helpers/external_interfaces/external_interface';
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
import { GetAllInstitutesUseCase } from './get_all_institutes_usecase';
import { UserAPIGatewayDTO } from 'src/shared/infra/database/dtos/user_api_gateway_dto';

export class GetAllInstitutesController {
  constructor(private readonly usecase: GetAllInstitutesUseCase) {}

  async handle(req: IRequest) {
    try {
      const { page } = req.data.query_params;
      const pageNumber = Number(page);

      if (isNaN(pageNumber) || pageNumber <= 0) {
        throw new MissingParameters('Número de página inválido');
      }

      const institutes = await this.usecase.execute(page);
      return new OK(institutes);
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
