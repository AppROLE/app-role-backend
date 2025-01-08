import { IRequest } from "src/shared/helpers/external_interfaces/external_interface";
import { GetProfileUseCase } from "./get_profile_usecase";
import { BadRequest, InternalServerError, NotFound, OK, Unauthorized } from "src/shared/helpers/external_interfaces/http_codes";
import { UserAPIGatewayDTO } from "src/shared/infra/database/dtos/user_api_gateway_dto";
import { GetProfileViewmodel } from "./get_profile_viewmodel";
import { ForbiddenAction, NoItemsFound } from "src/shared/helpers/errors/errors";
import { WrongTypeParameters } from "src/shared/helpers/errors/errors";

export class GetProfileController {
  constructor(private readonly usecase: GetProfileUseCase) {}

  async handle(request: IRequest, requesterUser: Record<string, any>) {
    try {

      if (!requesterUser) throw new ForbiddenAction('usuário')

      const personUsername = request.data.personUsername
      
      const { userId, username } = UserAPIGatewayDTO.fromAPIGateway(requesterUser).getParsedData();

      let profile;

      if (personUsername && personUsername !== username && typeof personUsername === 'string') {
        profile = await this.usecase.execute(personUsername, true, username);
      } else {
        profile = await this.usecase.execute(username, false);
      }

      console.log('username after api gateway dto', username);
      

      const viewmodel = new GetProfileViewmodel(
        profile.userId,
        profile.nickname,
        profile.username,
        profile.following,
        profile.followers,
        profile.privacy,
        profile.biography,
        profile.profilePhoto,
        profile.backgroundPhoto,
        profile.linkTiktok,
        profile.linkInstagram,
        profile.isFriend,
        profile.isFollowing,
        profile.email
      )

      return new OK(viewmodel.toJSON())

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
        return new InternalServerError(`GetProfileController, Error on handle: ${error.message}`);
      }
    }
  }
}