import { IRequest } from 'src/shared/helpers/external_interfaces/external_interface';
import {
  BadRequest,
  InternalServerError,
  NotFound,
  OK,
  Unauthorized,
} from 'src/shared/helpers/external_interfaces/http_codes';
import { UserAPIGatewayDTO } from 'src/shared/infra/database/dtos/user_api_gateway_dto';
import {
  ForbiddenAction,
  NoItemsFound,
} from 'src/shared/helpers/errors/errors';
import { WrongTypeParameters } from 'src/shared/helpers/errors/errors';
import { GetMyProfileViewmodel } from './get_my_profile_viewmodel';
import { GetMyProfileUseCase } from './get_my_profile_usecase';

export class GetMyProfileController {
  constructor(private readonly usecase: GetMyProfileUseCase) {}

  async handle(request: IRequest, requesterUser: Record<string, any>) {
    try {
      if (!requesterUser) throw new ForbiddenAction('usuário');

      const { userId } =
        UserAPIGatewayDTO.fromAPIGateway(requesterUser).getParsedData();

      const [profile, confirmedEvents] = await this.usecase.execute(userId);

      const viewmodel = new GetMyProfileViewmodel(profile, confirmedEvents);

      return new OK(viewmodel.toJSON());
    } catch (error: any) {
      if (error instanceof ForbiddenAction) {
        return new Unauthorized(error.message);
      }
      if (error instanceof WrongTypeParameters) {
        return new BadRequest(error.message);
      }
      if (error instanceof NoItemsFound) {
        return new NotFound(error.message);
      }
      if (error instanceof Error) {
        return new InternalServerError(
          `GetProfileController, Error on handle: ${error.message}`
        );
      }
    }
  }
}
