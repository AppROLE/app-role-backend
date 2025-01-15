import { CreateInstituteUseCase } from './create_institute_usecase';
import {
  INSTITUTE_TYPE,
  toEnum,
} from 'src/shared/domain/enums/institute_type_enum';
import {
  ForbiddenAction,
  MissingParameters,
  NoItemsFound,
  WrongTypeParameters,
} from 'src/shared/helpers/errors/errors';
import {
  BadRequest,
  Created,
  InternalServerError,
  NotFound,
  Unauthorized,
} from 'src/shared/helpers/external_interfaces/http_codes';
import { EntityError } from 'src/shared/helpers/errors/errors';
import { PARTNER_TYPE } from 'src/shared/domain/enums/partner_type_enum';
import { DuplicatedItem } from 'src/shared/helpers/errors/errors';
import { UserAPIGatewayDTO } from 'src/shared/infra/database/dtos/user_api_gateway_dto';
import { ROLE_TYPE } from 'src/shared/domain/enums/role_type_enum';
import { Address } from 'src/shared/domain/entities/address';
import {
  FormData,
  ParsedFile,
} from 'src/shared/helpers/functions/export_busboy';

export interface InstituteFormDataFields extends Address {
  name: string;
  description: string;
  instituteType: INSTITUTE_TYPE;
  partnerType: PARTNER_TYPE;
  phone?: string;
  price?: number;
}

export class CreateInstituteController {
  constructor(private readonly usecase: CreateInstituteUseCase) {}

  async handle(
    formData: FormData<InstituteFormDataFields>,
    requesterUser: Record<string, any>
  ) {
    const userApiGateway = UserAPIGatewayDTO.fromAPIGateway(requesterUser);

    if (!userApiGateway) throw new ForbiddenAction('Usuário');

    if (userApiGateway.role === ROLE_TYPE.COMMON)
      throw new ForbiddenAction('Usuário não tem permissão');
    try {
      let {
        description,
        instituteType,
        partnerType,
        name,
        latitude,
        longitude,
        street,
        number,
        district,
        neighborhood,
        city,
        state,
        cep,
        price,
        phone,
      } = formData.fields;

      number = Number(number);
      latitude = Number(latitude);
      longitude = Number(longitude);

      const { logo } = formData.files;

      if (logo === undefined || logo === null) {
        throw new MissingParameters('logo');
      }

      let logoPhoto: ParsedFile;

      !Array.isArray(logo) ? (logoPhoto = logo) : (logoPhoto = logo[0]);

      let photosImages: ParsedFile[];

      if (description === undefined || description === null) {
        throw new MissingParameters('description');
      }

      if (instituteType === undefined || instituteType === null) {
        throw new MissingParameters('instituteType');
      }

      if (partnerType === undefined || partnerType === null) {
        throw new MissingParameters('partnerType');
      }

      if (name === undefined || name === null) {
        throw new MissingParameters('name');
      }

      if (latitude === undefined || latitude === null) {
        throw new MissingParameters('latitude');
      }

      if (longitude === undefined || longitude === null) {
        throw new MissingParameters('longitude');
      }

      if (street === undefined || street === null) {
        throw new MissingParameters('street');
      }

      if (number === undefined || number === null) {
        throw new MissingParameters('number');
      }

      if (district === undefined || district === null) {
        throw new MissingParameters('district');
      }

      if (neighborhood === undefined || neighborhood === null) {
        throw new MissingParameters('neighborhood');
      }

      if (city === undefined || city === null) {
        throw new MissingParameters('city');
      }

      if (state === undefined || state === null) {
        throw new MissingParameters('state');
      }

      if (cep === undefined || cep === null) {
        throw new MissingParameters('cep');
      }
      const institute = await this.usecase.execute({
        name,
        description,
        instituteType,
        partnerType,
        phone,
        address: {
          latitude,
          longitude,
          street,
          number,
          district,
          neighborhood,
          city,
          state,
          cep,
        },
        price,
        logoPhoto,
      });

      return new Created({
        message: 'Instituição criada com sucesso',
        id: institute.instituteId,
      });
    } catch (error: any) {
      if (
        error instanceof EntityError ||
        error instanceof MissingParameters ||
        error instanceof WrongTypeParameters
      ) {
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
