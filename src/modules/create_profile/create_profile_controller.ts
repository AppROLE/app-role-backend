import {
  ForbiddenAction,
  MissingParameters,
  NoItemsFound,
  RecognitionError,
  UserAlreadyExists,
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
import { UserAPIGatewayDTO } from 'src/shared/infra/database/dtos/user_api_gateway_dto';
import { CreateProfileUsecase } from './create_profile_usecase';
import { CreateProfileViewmodel } from './create_profile_viewmodel';
import {
  FormData,
  ParsedFile,
} from 'src/shared/helpers/functions/export_busboy';

export interface ProfileFormDataFields {
  username: string;
  nickname: string;
  acceptedTerms: string;
}

export class CreateProfileController {
  constructor(private readonly usecase: CreateProfileUsecase) {}

  async handle(
    formData: FormData<ProfileFormDataFields>,
    requesterUser: Record<string, any>
  ) {
    try {
      const userApiGateway = UserAPIGatewayDTO.fromAPIGateway(requesterUser);

      if (!userApiGateway) throw new ForbiddenAction('Usuário');

      let { username, nickname, acceptedTerms } = formData.fields;

      const profileImage = formData.files['profileImage'];

      if (profileImage === undefined) {
        throw new MissingParameters('profileImage');
      }

      let photoImage: ParsedFile;

      !Array.isArray(profileImage)
        ? (photoImage = profileImage)
        : (photoImage = profileImage[0]);

      if (typeof username !== 'string') {
        throw new WrongTypeParameters('username', 'string', typeof username);
      }

      if (typeof nickname !== 'string') {
        throw new WrongTypeParameters('nickname', 'string', typeof nickname);
      }

      const boolAcceptedTerms = acceptedTerms === 'true' ? true : false;

      if (typeof boolAcceptedTerms !== 'boolean') {
        throw new WrongTypeParameters(
          'acceptedTerms',
          'boolean',
          typeof acceptedTerms
        );
      }

      const profile = await this.usecase.execute({
        userId: userApiGateway.userId,
        name: userApiGateway.name,
        username: username,
        nickname: nickname,
        email: userApiGateway.email,
        acceptedTerms: boolAcceptedTerms,
        image: photoImage,
      });

      const viewmodel = new CreateProfileViewmodel(profile);

      return new Created(viewmodel.toJSON());
    } catch (error: any) {
      if (
        error instanceof EntityError ||
        error instanceof MissingParameters ||
        error instanceof WrongTypeParameters ||
        error instanceof RecognitionError
      ) {
        return new BadRequest(error.message);
      }

      if (error instanceof ForbiddenAction) {
        return new Unauthorized(error.message);
      }

      if (error instanceof NoItemsFound) {
        return new NotFound(error.message);
      }

      if (error instanceof UserAlreadyExists) {
        return new Conflict(error.message);
      }

      if (error instanceof Error) {
        return new InternalServerError(error.message);
      }
    } finally {
      await this.usecase.repository.closeSession();
    }
  }
}
