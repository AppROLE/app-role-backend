import { IRequest } from 'src/shared/helpers/external_interfaces/external_interface';
import { UserAPIGatewayDTO } from 'src/shared/infra/database/dtos/user_api_gateway_dto';
import {
  ConflictItems,
  EntityError,
  ForbiddenAction,
  NoItemsFound,
} from 'src/shared/helpers/errors/errors';
import {
  MissingParameters,
  WrongTypeParameters,
} from 'src/shared/helpers/errors/errors';
import {
  BadRequest,
  Conflict,
  InternalServerError,
  NotFound,
  OK,
  Unauthorized,
} from 'src/shared/helpers/external_interfaces/http_codes';
import { ReactivateUserUsecase } from './reactivate_user_usecase';

export class ReactivateUserController {
  constructor(private readonly usecase: ReactivateUserUsecase) {}

  async handle(request: IRequest) {
    try {
      const { email } = request.data.body;

      if (!email) throw new MissingParameters('email');
      if (typeof email !== 'string')
        throw new WrongTypeParameters('email', 'string', typeof email);

      await this.usecase.execute(email);

      return new OK({
        message: 'Perfil excluído com sucesso',
      });
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
