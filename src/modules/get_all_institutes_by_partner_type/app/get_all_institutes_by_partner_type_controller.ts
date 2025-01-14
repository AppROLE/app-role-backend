import { IRequest } from 'src/shared/helpers/external_interfaces/external_interface';
import { GetAllInstitutesByPartnerTypeUseCase } from './get_all_institutes_by_partner_type_usecase';
import {
  ConflictItems,
  EntityError,
  ForbiddenAction,
  MissingParameters,
  WrongTypeParameters,
} from 'src/shared/helpers/errors/errors';
import {
  PARTNER_TYPE,
  toEnumPartnerType,
} from 'src/shared/domain/enums/partner_type_enum';
import {
  BadRequest,
  Conflict,
  InternalServerError,
  NotFound,
  OK,
  Unauthorized,
} from 'src/shared/helpers/external_interfaces/http_codes';
import { NoItemsFound } from 'src/shared/helpers/errors/errors';
import { UserAPIGatewayDTO } from 'src/shared/infra/database/dtos/user_api_gateway_dto';

export interface GetAllInstitutesByPartnerTypeRequestBody {
  partnerType: string;
}

export class GetAllInstitutesByPartnerTypeController {
  constructor(private readonly usecase: GetAllInstitutesByPartnerTypeUseCase) {}

  async handle(
    req: IRequest<GetAllInstitutesByPartnerTypeRequestBody>,
    requesterUser: Record<string, any>
  ): Promise<any> {
    try {
      const userApiGateway = UserAPIGatewayDTO.fromAPIGateway(requesterUser);

      if (!userApiGateway) throw new ForbiddenAction('Usuário');

      const { page, partnerType } = req.data.query_params;

      if (typeof partnerType !== 'string') {
        throw new WrongTypeParameters(
          'partnerType',
          'string',
          typeof partnerType
        );
      }

      const pageNumber = Number(page);

      if (isNaN(pageNumber) || pageNumber <= 0) {
        throw new MissingParameters('Número de página inválido');
      }

      const partnerTypeEnum = toEnumPartnerType(partnerType);

      const institutesPaginated = await this.usecase.execute(
        page,
        partnerTypeEnum
      );

      return new OK(institutesPaginated);
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
