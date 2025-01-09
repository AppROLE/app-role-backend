import { IRequest } from 'src/shared/helpers/external_interfaces/external_interface';
import { GetAllInstitutesByPartnerTypeUseCase } from './get_all_institutes_by_partner_type_usecase';
import { WrongTypeParameters } from 'src/shared/helpers/errors/errors';
import {
  PARTNER_TYPE,
  toEnumPartnerType,
} from 'src/shared/domain/enums/partner_type_enum';
import { GetAllInstitutesByPartnerTypeViewModel } from './get_all_institutes_by_partner_type_viewmodel';
import {
  InternalServerError,
  NotFound,
  OK,
} from 'src/shared/helpers/external_interfaces/http_codes';
import { NoItemsFound } from 'src/shared/helpers/errors/errors';

export interface GetAllInstitutesByPartnerTypeRequestBody {
  partnerType: string;
}

export class GetAllInstitutesByPartnerTypeController {
  constructor(private readonly usecase: GetAllInstitutesByPartnerTypeUseCase) {}

  async handle(
    req: IRequest<GetAllInstitutesByPartnerTypeRequestBody>
  ): Promise<any> {
    const { partnerType } = req.data.body;

    try {
      if (typeof partnerType !== 'string') {
        throw new WrongTypeParameters(
          'partnerType',
          'string',
          typeof partnerType
        );
      }

      const partnerTypeEnum = toEnumPartnerType(partnerType);

      const institutes = await this.usecase.execute(partnerTypeEnum);

      const viewmodel = new GetAllInstitutesByPartnerTypeViewModel(institutes);

      return new OK(viewmodel.toJSON());
    } catch (error: any) {
      if (error instanceof WrongTypeParameters) {
        return new NotFound(error.message);
      }
      if (error instanceof NoItemsFound) {
        return new NotFound(error.message);
      }
      if (error instanceof Error) {
        return new InternalServerError(
          `GetAllInstitutesByPartnerTypeController, Error on handle: ${error.message}`
        );
      }
    } finally {
      await this.usecase.repository.closeSession();
    }
  }
}
