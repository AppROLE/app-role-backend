import { IRequest } from 'src/shared/helpers/external_interfaces/external_interface';
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
import { GetOtherFollowersUsecase } from './get_other_followers_usecase';

export class GetOtherFollowersController {
  constructor(private readonly usecase: GetOtherFollowersUsecase) {}

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

      const profilesPagination = await this.usecase.execute(
        userApiGateway.userId,
        otherUserId,
        pageNumber
      );

      return new OK(profilesPagination);
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
