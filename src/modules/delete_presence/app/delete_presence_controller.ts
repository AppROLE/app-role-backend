import { IRequest } from 'src/shared/helpers/external_interfaces/external_interface';
import { DeletePresenceUsecase } from './delete_presence_usecase';
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

export class DeletePresenceController {
  constructor(private readonly usecase: DeletePresenceUsecase) {}

  async handle(request: IRequest, requesterUser: Record<string, any>) {
    try {
      const userApiGateway = UserAPIGatewayDTO.fromAPIGateway(requesterUser);

      if (!userApiGateway) throw new ForbiddenAction('Usuário');

      const { presenceId } = request.data.body;

      if (!presenceId) throw new MissingParameters('presenceId');
      if (typeof presenceId !== 'string')
        throw new WrongTypeParameters('presenceId', 'string', typeof presenceId);

      await this.usecase.execute(presenceId, userApiGateway.userId);

      return new OK({
        message: 'Presença cancelada com sucesso',
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
