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

export class CreateInstituteController {
  constructor(private readonly usecase: CreateInstituteUseCase) {}

  async handle(
    formData: Record<string, any>,
    requesterUser: Record<string, any>
  ) {
    const userApiGateway = UserAPIGatewayDTO.fromAPIGateway(requesterUser);

    if (!userApiGateway) throw new ForbiddenAction('Usuário');

    if (userApiGateway.role === ROLE_TYPE.COMMON)
      throw new ForbiddenAction('Usuário não tem permissão');
    try {
      const {
        description,
        institute_type,
        partner_type,
        name,
        latitude,
        longitude,
        address,
        number,
        neighborhood,
        city,
        state,
        cep,
        price,
        phone,
      } = formData.fields;

      const logo = formData.files['logoPhoto'];

      if (logo === undefined) {
        throw new MissingParameters('logoPhoto');
      }

      const photos = formData.files['photos'] || [];

      const requiredParams = [
        'description',
        'institute_type',
        'partner_type',
        'name',
      ];

      for (const param of requiredParams) {
        if (formData.fields[param] === undefined) {
          throw new MissingParameters(param);
        }
      }

      if (typeof description !== 'string') {
        throw new WrongTypeParameters(
          'description',
          'string',
          typeof description
        );
      }
      if (typeof institute_type !== 'string') {
        throw new WrongTypeParameters(
          'institute_type',
          'string',
          typeof institute_type
        );
      }
      if (typeof partner_type !== 'string') {
        throw new WrongTypeParameters(
          'partner_type',
          'string',
          typeof partner_type
        );
      }
      if (typeof name !== 'string') {
        throw new WrongTypeParameters('name', 'string', typeof name);
      }

      if (typeof latitude !== 'number') {
        throw new WrongTypeParameters('latitude', 'number', typeof latitude);
      }
      if (typeof longitude !== 'number') {
        throw new WrongTypeParameters('longitude', 'number', typeof longitude);
      }
      if (typeof address !== 'string') {
        throw new WrongTypeParameters('address', 'string', typeof address);
      }
      if (typeof neighborhood !== 'string') {
        throw new WrongTypeParameters(
          'neighborhood',
          'string',
          typeof neighborhood
        );
      }
      if (typeof city !== 'string') {
        throw new WrongTypeParameters('city', 'string', typeof city);
      }
      if (typeof state !== 'string') {
        throw new WrongTypeParameters('state', 'string', typeof state);
      }
      if (typeof cep !== 'string') {
        throw new WrongTypeParameters('cep', 'string', typeof cep);
      }

      if (price !== undefined) {
        if (typeof price !== 'number') {
          throw new WrongTypeParameters('price', 'number', typeof price);
        }
      }

      if (phone !== undefined) {
        if (typeof phone !== 'string') {
          throw new WrongTypeParameters('phone', 'string', typeof phone);
        }
      }

      const institute = await this.usecase.execute({
        name: name,
        description: description,
        institute_type:
          INSTITUTE_TYPE[institute_type as keyof typeof INSTITUTE_TYPE],
        partner_type: PARTNER_TYPE[partner_type as keyof typeof PARTNER_TYPE],
        phone: phone,
        address: {
          latitude: latitude,
          longitude: longitude,
          street: address,
          number: number,
          neighborhood: neighborhood,
          city: city,
          state: state,
          cep: cep,
        },
        price: price,
        logoPhoto: logo,
        photos: photos,
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
