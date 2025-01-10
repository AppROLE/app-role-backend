import { IRequest } from 'src/shared/helpers/external_interfaces/external_interface';
import { CreateEventUseCase } from 'src/modules/create_event/app/create_event_usecase';
import {
  ConflictItems,
  ForbiddenAction,
  MissingParameters,
  NoItemsFound,
  WrongTypeParameters,
} from 'src/shared/helpers/errors/errors';
import {
  BadRequest,
  Conflict,
  Created,
  InternalServerError,
  NotFound,
  Unauthorized,
} from 'src/shared/helpers/external_interfaces/http_codes';
import { EntityError } from 'src/shared/helpers/errors/errors';
import { STATUS } from 'src/shared/domain/enums/status_enum';
import { CATEGORY } from 'src/shared/domain/enums/category_enum';
import { AGE_ENUM } from 'src/shared/domain/enums/age_enum';
import { UserAPIGatewayDTO } from 'src/shared/infra/database/dtos/user_api_gateway_dto';
import { ROLE_TYPE } from 'src/shared/domain/enums/role_type_enum';

export class CreateEventController {
  constructor(private readonly usecase: CreateEventUseCase) {}

  async handle(
    formData: Record<string, any>,
    requesterUser: Record<string, any>
  ) {
    try {
      const userApiGateway = UserAPIGatewayDTO.fromAPIGateway(requesterUser);

      if (!userApiGateway) throw new ForbiddenAction('Usuário');

      if (userApiGateway.role === ROLE_TYPE.COMMON)
        throw new ForbiddenAction('Usuário não tem permissão');

      const {
        name,
        description,
        latitude,
        longitude,
        street,
        number,
        neighborhood,
        city,
        state,
        cep,
        price,
        ageRange,
        instituteId,
        musicType,
        menuLink,
        features,
        packageType,
        category,
        ticketUrl,
        eventDate,
      } = formData.fields;

      const photo = formData.files['photo'];

      if (photo === undefined) {
        throw new MissingParameters('photo');
      }

      const gallery = formData.files['gallery'] || [];

      const requiredParams = [
        'name',
        'description',
        'location',
        'price',
        'ageRange',
        'eventDate',
        'instituteId',
        'eventStatus',
      ];

      for (const param of requiredParams) {
        if (formData.fields[param] === undefined) {
          throw new MissingParameters(param);
        }
      }

      if (typeof name !== 'string') {
        throw new WrongTypeParameters('name', 'string', typeof name);
      }
      if (typeof description !== 'string') {
        throw new WrongTypeParameters(
          'description',
          'string',
          typeof description
        );
      }
      if (typeof latitude !== 'number') {
        throw new WrongTypeParameters('latitude', 'number', typeof latitude);
      }
      if (typeof longitude !== 'number') {
        throw new WrongTypeParameters('longitude', 'number', typeof longitude);
      }
      if (typeof street !== 'string') {
        throw new WrongTypeParameters('street', 'string', typeof street);
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
      if (typeof price !== 'number') {
        throw new WrongTypeParameters('price', 'number', typeof price);
      }
      if (typeof ageRange !== 'string') {
        throw new WrongTypeParameters('ageRange', 'string', typeof ageRange);
      }

      if (!(eventDate instanceof number) || isNaN(eventDate.getTime())) {
        throw new WrongTypeParameters('eventDate', 'number', typeof eventDate);
      }

      if (typeof instituteId !== 'string') {
        throw new WrongTypeParameters(
          'instituteId',
          'string',
          typeof instituteId
        );
      }

      const eventId = await this.usecase.execute({
        name,
        description,
        address: {
          latitude,
          longitude,
          street,
          number,
          neighborhood,
          city,
          state,
          cep,
        },
        price,
        ageRange: Object.values(AGE_ENUM).includes(ageRange as AGE_ENUM)
          ? (ageRange as AGE_ENUM)
          : AGE_ENUM.DEFAULT,
        eventDate: eventDate,
        instituteId,
        musicType: musicType,
        menuLink: typeof menuLink === 'string' ? menuLink : undefined,
        galeryImages: gallery,
        eventImage: photo,
        features: features,
        packageType: packageType,
        category: category
          ? CATEGORY[category as keyof typeof CATEGORY]
          : undefined,
        ticketUrl: typeof ticketUrl === 'string' ? ticketUrl : undefined,
      });

      return new Created({
        message: 'Evento criado com sucesso',
        id: eventId,
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
