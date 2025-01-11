import { IRequest } from 'src/shared/helpers/external_interfaces/external_interface';
import { CreatePresenceUsecase } from './create_presence_usecase';
import { EntityError } from 'src/shared/helpers/errors/errors';
import {
  MissingParameters,
  WrongTypeParameters,
} from 'src/shared/helpers/errors/errors';
import { UserAPIGatewayDTO } from 'src/shared/infra/database/dtos/user_api_gateway_dto';
import {
  ForbiddenAction,
  NoItemsFound,
  UserAlreadyConfirmedEvent,
} from 'src/shared/helpers/errors/errors';
import {
  BadRequest,
  InternalServerError,
  NotFound,
  OK,
  Unauthorized,
} from 'src/shared/helpers/external_interfaces/http_codes';
import { ROLE_TYPE } from 'src/shared/domain/enums/role_type_enum';

interface CreaterPresenceData {
  eventId: string;
  promoterCode?: string;
}

export class CreatePresenceController {
  constructor(private readonly usecase: CreatePresenceUsecase) {}

  async handle(request: IRequest, requesterUser: Record<string, any>) {
    try {
      const userApiGateway = UserAPIGatewayDTO.fromAPIGateway(requesterUser);

      if (!userApiGateway) throw new ForbiddenAction('Usuário');

      const { eventId, promoterCode } =
        request.data.body;

      if (!eventId) throw new MissingParameters('eventId');
      if (typeof eventId !== 'string')
        throw new WrongTypeParameters('eventId', 'string', typeof eventId);

      if (promoterCode && typeof promoterCode !== 'string')
        throw new WrongTypeParameters(
          'promoterCode',
          'string',
          typeof promoterCode
        );

      const presence = await this.usecase.execute(eventId, userApiGateway.userId, promoterCode);

      return new OK({
        presence: presence,
        message: 'Presença confirmada com sucesso',
      });
    } catch (error: any) {
      if (
        error instanceof EntityError ||
        error instanceof MissingParameters ||
        error instanceof WrongTypeParameters
      ) {
        return new BadRequest(error.message);
      }

      if (error instanceof UserAlreadyConfirmedEvent) {
        return new BadRequest(error.message);
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
