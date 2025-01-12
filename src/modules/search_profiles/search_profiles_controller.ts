import { IRequest } from 'src/shared/helpers/external_interfaces/external_interface';
import {
  BadRequest,
  Conflict,
  InternalServerError,
  NotFound,
  OK,
  Unauthorized,
} from 'src/shared/helpers/external_interfaces/http_codes';
import {
  ConflictItems,
  EntityError,
  ForbiddenAction,
  MissingParameters,
  NoItemsFound,
  WrongTypeParameters,
} from 'src/shared/helpers/errors/errors';
import { UserAPIGatewayDTO } from 'src/shared/infra/database/dtos/user_api_gateway_dto';
import { SearchProfilesUsecase } from './search_profiles_usecase';

export class SearchProfilesController {
  constructor(private readonly usecase: SearchProfilesUsecase) {}

  async handle(req: IRequest, requesterUser: Record<string, any>) {
    try {
      const userApiGateway = UserAPIGatewayDTO.fromAPIGateway(requesterUser);

      if (!userApiGateway) throw new ForbiddenAction('Usuário');
    
      const { searchTerm } = req.data.query_params;

      const profiles = await this.usecase.execute(searchTerm);

      return new OK(profiles);

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
