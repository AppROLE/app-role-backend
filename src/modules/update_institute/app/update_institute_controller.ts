import { IRequest } from 'src/shared/helpers/external_interfaces/external_interface';
import { UpdateInstituteUseCase } from './update_institute_usecase';
import {
  BadRequest,
  InternalServerError,
  NotFound,
  OK,
} from 'src/shared/helpers/external_interfaces/http_codes';
import {
  MissingParameters,
  WrongTypeParameters,
} from 'src/shared/helpers/errors/errors';
import { INSTITUTE_TYPE } from 'src/shared/domain/enums/institute_type_enum';
import { PARTNER_TYPE } from 'src/shared/domain/enums/partner_type_enum';
import { UpdateInstituteViewModel } from './update_institute_viewmodel';
import { EntityError } from 'src/shared/helpers/errors/errors';
import { NoItemsFound } from 'src/shared/helpers/errors/errors';

export interface UpdateInstituteRequestBody {
  instituteId: string;
  description?: string;
  institute_type?: INSTITUTE_TYPE;
  partner_type?: PARTNER_TYPE;
  name?: string;
  phone?: string;
}

export class UpdateInstituteController {
  constructor(private readonly usecase: UpdateInstituteUseCase) {}

  async handle(req: IRequest<UpdateInstituteRequestBody>) {
    try {
      const {
        instituteId,
        description,
        institute_type,
        partner_type,
        name,
        phone,
      } = req.data.body;

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
      if (institute_type !== undefined) {
        if (typeof institute_type !== 'string') {
          throw new WrongTypeParameters(
            'institute_type',
            'string',
            typeof institute_type
          );
        }
      }
      if (partner_type !== undefined) {
        if (typeof partner_type !== 'string') {
          throw new WrongTypeParameters(
            'partner_type',
            'string',
            typeof partner_type
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

      await this.usecase.execute(
        instituteId,
        description,
        INSTITUTE_TYPE[institute_type as keyof typeof INSTITUTE_TYPE],
        PARTNER_TYPE[partner_type as keyof typeof PARTNER_TYPE],
        name,
        phone
      );

      const viewmodel = new UpdateInstituteViewModel(
        'Instituto atualizado com sucesso'
      );

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
