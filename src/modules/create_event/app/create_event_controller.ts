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
import { CATEGORY } from 'src/shared/domain/enums/category_enum';
import { AGE_ENUM } from 'src/shared/domain/enums/age_enum';
import { UserAPIGatewayDTO } from 'src/shared/infra/database/dtos/user_api_gateway_dto';
import { ROLE_TYPE } from 'src/shared/domain/enums/role_type_enum';
import { Address } from 'src/shared/domain/entities/address';
import { MUSIC_TYPE } from 'src/shared/domain/enums/music_type_enum';
import { PACKAGE_TYPE } from 'src/shared/domain/enums/package_type_enum';
import { FEATURE } from 'src/shared/domain/enums/feature_enum';
import {
  FormData,
  ParsedFile,
} from 'src/shared/helpers/functions/export_busboy';

export interface EventFormDataFields extends Address {
  name: string;
  description: string;
  address: Address;
  price: number;
  ageRange: AGE_ENUM;
  eventDate: number;
  instituteId: string;
  musicType: string; // json parse
  menuLink?: string;
  packageType: PACKAGE_TYPE[];
  category?: CATEGORY;
  ticketUrl?: string;
  features: FEATURE[];
}

export class CreateEventController {
  constructor(private readonly usecase: CreateEventUseCase) {}

  async handle(
    formData: FormData<EventFormDataFields>,
    requesterUser: Record<string, any>
  ) {
    try {
      const userApiGateway = UserAPIGatewayDTO.fromAPIGateway(requesterUser);

      if (!userApiGateway) throw new ForbiddenAction('Usuário');

      if (userApiGateway.role === ROLE_TYPE.COMMON)
        throw new ForbiddenAction('Usuário não tem permissão');

      let {
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

      eventDate = Number(eventDate);
      price = Number(price);
      latitude = Number(latitude);
      longitude = Number(longitude);
      number = Number(number);
      const musicTypeList = JSON.parse(musicType) as MUSIC_TYPE[];

      const { gallery, photo } = formData.files;

      if (photo === undefined || photo === null) {
        throw new MissingParameters('photo');
      }

      let photoImage: ParsedFile;

      !Array.isArray(photo) ? (photoImage = photo) : (photoImage = photo[0]);

      let galleryImages: ParsedFile[];

      if (gallery === undefined || gallery === null) {
        galleryImages = [];
      } else if (Array.isArray(gallery)) {
        galleryImages = gallery;
      } else if (!Array.isArray(gallery)) {
        galleryImages = [gallery];
      } else {
        throw new MissingParameters('photos');
      }

      if (name === undefined || name === null) {
        throw new MissingParameters('name');
      }

      if (description === undefined || description === null) {
        throw new MissingParameters('description');
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

      if (price === undefined || price === null) {
        throw new MissingParameters('price');
      }

      if (ageRange === undefined || ageRange === null) {
        throw new MissingParameters('ageRange');
      }

      if (instituteId === undefined || instituteId === null) {
        throw new MissingParameters('instituteId');
      }

      if (musicType === undefined || musicType === null) {
        throw new MissingParameters('musicType');
      }

      if (features === undefined || features === null) {
        throw new MissingParameters('features');
      }

      if (packageType === undefined || packageType === null) {
        throw new MissingParameters('packageType');
      }

      if (eventDate === undefined || eventDate === null) {
        throw new MissingParameters('eventDate');
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
        ageRange,
        eventDate,
        instituteId,
        musicType: musicTypeList,
        menuLink,
        galleryImages: galleryImages,
        eventImage: photoImage,
        features,
        packageType,
        category,
        ticketUrl,
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
