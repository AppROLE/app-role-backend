import { IRequest } from 'src/shared/helpers/external_interfaces/external_interface';
import { UpdateInstituteUseCase } from './update_institute_usecase';
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
  ForbiddenAction,
  MissingParameters,
  WrongTypeParameters,
} from 'src/shared/helpers/errors/errors';
import { INSTITUTE_TYPE } from 'src/shared/domain/enums/institute_type_enum';
import { PARTNER_TYPE } from 'src/shared/domain/enums/partner_type_enum';
import { EntityError } from 'src/shared/helpers/errors/errors';
import { NoItemsFound } from 'src/shared/helpers/errors/errors';
import { UserAPIGatewayDTO } from 'src/shared/infra/database/dtos/user_api_gateway_dto';
import { ROLE_TYPE } from 'src/shared/domain/enums/role_type_enum';

export interface UpdateInstituteRequestBody {
  instituteId: string;
  description?: string;
  instituteType?: INSTITUTE_TYPE;
  partnerType?: PARTNER_TYPE;
  name?: string;
  phone?: string;
}

export class UpdateInstituteController {
  constructor(private readonly usecase: UpdateInstituteUseCase) {}

  async handle(request: IRequest, requesterUser: Record<string, any>) {
    try {
      const userApiGateway = UserAPIGatewayDTO.fromAPIGateway(requesterUser);

      if (!userApiGateway) throw new ForbiddenAction('Usuário');

      if (userApiGateway.role === ROLE_TYPE.COMMON)
        throw new ForbiddenAction('Usuário não tem permissão');

      const {
        instituteId,
        description,
        instituteType,
        partnerType,
        name,
        phone,
      } = request.data.body;

      if (instituteId === undefined) {
        throw new MissingParameters('instituteId');
      }

      if (typeof instituteId !== 'string') {
        throw new WrongTypeParameters(
          'instituteId',
          'string',
          typeof instituteId
        );
      }

      if (description !== undefined) {
        if (typeof description !== 'string') {
          throw new WrongTypeParameters(
            'description',
            'string',
            typeof description
          );
        }
      }
      if (instituteType !== undefined) {
        if (typeof instituteType !== 'string') {
          throw new WrongTypeParameters(
            'instituteType',
            'string',
            typeof instituteType
          );
        }
      }
      if (partnerType !== undefined) {
        if (typeof partnerType !== 'string') {
          throw new WrongTypeParameters(
            'partnerType',
            'string',
            typeof partnerType
          );
        }
      }
      if (name !== undefined) {
        if (typeof name !== 'string') {
          throw new WrongTypeParameters('name', 'string', typeof name);
        }
      }

      if (phone !== undefined) {
        if (typeof phone !== 'string') {
          throw new WrongTypeParameters('phone', 'string', typeof phone);
        }
      }

      const institute = await this.usecase.execute(
        {instituteId,
        description,
        instituteType,
        partnerType,
        name,
        phone}
      );

      return new OK({
        institute: institute,
        message: 'Instituição atualizada com sucesso',
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
