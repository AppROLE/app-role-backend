import { AGE_ENUM } from 'src/shared/domain/enums/age_enum';
import { CATEGORY } from 'src/shared/domain/enums/category_enum';
import { ROLE_TYPE } from 'src/shared/domain/enums/role_type_enum';
import { STATUS } from 'src/shared/domain/enums/status_enum';
import {
  ConflictItems,
  EntityError,
  ForbiddenAction,
  MissingParameters,
  NoItemsFound,
  WrongTypeParameters,
} from 'src/shared/helpers/errors/errors';
import { UserAPIGatewayDTO } from 'src/shared/infra/database/dtos/user_api_gateway_dto';
import { UpdateEventUsecase } from './update_event_usecase';
import { UpdateEventViewModel } from './update_event_viewmodel';
import {
  BadRequest,
  Conflict,
  InternalServerError,
  NotFound,
  OK,
  Unauthorized,
} from 'src/shared/helpers/external_interfaces/http_codes';

export class UpdateEventController {
  constructor(private readonly usecase: UpdateEventUsecase) {}

  async handle(
    formData: Record<string, any>,
    requesterUser: Record<string, any>
  ) {
    try {
      const userApiGateway = UserAPIGatewayDTO.fromAPIGateway(requesterUser);
      if (!userApiGateway) throw new ForbiddenAction('Usuário');
      if (userApiGateway.role === ROLE_TYPE.COMMON)
        throw new ForbiddenAction('Usuário não tem permissão');

      // Extrair dados do formulário
      const {
        eventId,
        name,
        description,
        latitude,
        longitude,
        address,
        number,
        neighborhood,
        city,
        state,
        cep,
        price,
        ageRange,
        instituteId,
        eventStatus,
        musicType,
        menuLink,
        features,
        packageType,
        category,
        ticketUrl,
        eventDate,
      } = formData.fields;

      const photo = formData.files['photo'];
      const gallery = formData.files['gallery'] || [];

      if (!eventId) throw new MissingParameters('eventId');

      if (name !== undefined && typeof name !== 'string') {
        throw new WrongTypeParameters('name', 'string', typeof name);
      }
      if (description !== undefined && typeof description !== 'string') {
        throw new WrongTypeParameters(
          'description',
          'string',
          typeof description
        );
      }
      if (latitude !== undefined && typeof latitude !== 'number') {
        throw new WrongTypeParameters('latitude', 'number', typeof latitude);
      }
      if (longitude !== undefined && typeof longitude !== 'number') {
        throw new WrongTypeParameters('longitude', 'number', typeof longitude);
      }
      if (address !== undefined && typeof address !== 'string') {
        throw new WrongTypeParameters('address', 'string', typeof address);
      }
      if (neighborhood !== undefined && typeof neighborhood !== 'string') {
        throw new WrongTypeParameters(
          'neighborhood',
          'string',
          typeof neighborhood
        );
      }
      if (city !== undefined && typeof city !== 'string') {
        throw new WrongTypeParameters('city', 'string', typeof city);
      }
      if (state !== undefined && typeof state !== 'string') {
        throw new WrongTypeParameters('state', 'string', typeof state);
      }
      if (cep !== undefined && typeof cep !== 'string') {
        throw new WrongTypeParameters('cep', 'string', typeof cep);
      }
      if (price !== undefined && typeof price !== 'number') {
        throw new WrongTypeParameters('price', 'number', typeof price);
      }
      if (ageRange !== undefined && typeof ageRange !== 'string') {
        throw new WrongTypeParameters('ageRange', 'string', typeof ageRange);
      }
      if (eventDate !== undefined && !(eventDate instanceof Number)) {
        throw new WrongTypeParameters('eventDate', 'number', typeof eventDate);
      }
      if (instituteId !== undefined && typeof instituteId !== 'string') {
        throw new WrongTypeParameters(
          'instituteId',
          'string',
          typeof instituteId
        );
      }
      if (eventStatus !== undefined && typeof eventStatus !== 'string') {
        throw new WrongTypeParameters(
          'eventStatus',
          'string',
          typeof eventStatus
        );
      }

      // Montar os campos para atualização
      const updatedFields = {
        name,
        description,
        address: {
          latitude,
          longitude,
          street: address,
          number,
          neighborhood,
          city,
          state,
          cep,
        },
        price,
        ageRange: Object.values(AGE_ENUM).includes(ageRange as AGE_ENUM)
          ? (ageRange as AGE_ENUM)
          : undefined,
        eventDate,
        instituteId,
        eventStatus: eventStatus
          ? STATUS[eventStatus as keyof typeof STATUS]
          : undefined,
        musicType,
        menuLink: typeof menuLink === 'string' ? menuLink : undefined,
        galleryImages: gallery,
        eventImage: photo,
        features,
        packageType,
        category: category
          ? CATEGORY[category as keyof typeof CATEGORY]
          : undefined,
        ticketUrl: typeof ticketUrl === 'string' ? ticketUrl : undefined,
      };

      // Executar o caso de uso para atualizar o evento
      await this.usecase.execute({
        eventId,
        ...updatedFields,
      });

      const viewmodel = new UpdateEventViewModel(
        'Evento atualizado com sucesso'
      );

      return new OK(viewmodel.toJSON());
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
