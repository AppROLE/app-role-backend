import { IRequest } from 'src/shared/helpers/external_interfaces/external_interface';
import { GetProfileUseCase } from './get_other_profile_usecase';
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
import { GetOtherProfileViewmodel } from './get_other_profile_viewmodel';

export class GetProfileController {
  constructor(private readonly usecase: GetProfileUseCase) {}

  async handle(request: IRequest, requesterUser: Record<string, any>) {
    try {
      if (!requesterUser) throw new ForbiddenAction('usuário');

      const { otherUserId } = request.data.body;

      const { userId, username } =
        UserAPIGatewayDTO.fromAPIGateway(requesterUser).getParsedData();

      const [profile, confirmedEvents] = await this.usecase.execute(
        userId,
        otherUserId
      );

      const viewmodel = new GetOtherProfileViewmodel(profile, confirmedEvents);

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
