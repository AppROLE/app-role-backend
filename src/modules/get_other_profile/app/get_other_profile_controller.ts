import { IRequest } from 'src/shared/helpers/external_interfaces/external_interface';
import { GetOtherProfileUseCase } from './get_other_profile_usecase';
import {
  BadRequest,
  Conflict,
  InternalServerError,
  NotFound,
  OK,
  Unauthorized,
} from 'src/shared/helpers/external_interfaces/http_codes';
import { UserAPIGatewayDTO } from 'src/shared/infra/database/dtos/user_api_gateway_dto';
import {
  ConflictItems,
  EntityError,
  ForbiddenAction,
  MissingParameters,
  NoItemsFound,
} from 'src/shared/helpers/errors/errors';
import { WrongTypeParameters } from 'src/shared/helpers/errors/errors';

export class GetOtherProfileController {
  constructor(private readonly usecase: GetOtherProfileUseCase) {}

  async handle(request: IRequest, requesterUser: Record<string, any>) {
    try {
      const userApiGateway = UserAPIGatewayDTO.fromAPIGateway(requesterUser);

      if (!userApiGateway) throw new ForbiddenAction('Usuário');

      const { otherUserId, page } = request.data.query_params;

      if (!otherUserId) throw new MissingParameters('otherUserId');

      const pageNumber = Number(page);

      if (isNaN(pageNumber) || pageNumber <= 0) {
        throw new MissingParameters('Número de página inválido');
      }

      const [profile, confirmedEvents] = await this.usecase.execute(
        pageNumber,
        userApiGateway.userId,
        otherUserId
      );

      return new OK({
        profile: {
          userId: profile.userId,
          nickname: profile.nickname,
          username: profile.username,
          biography: profile.biography,
          linkInstagram: profile.linkInstagram,
          linkTiktok: profile.linkTiktok,
          backgroundPhoto: profile.backgroundPhoto,
          profilePhoto: profile.profilePhoto,
          followers: profile.followers.length,
          following: profile.following.length,
        },
        confirmedEvents: confirmedEvents,
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
