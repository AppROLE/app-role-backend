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
import {
  FormData,
  ParsedFile,
} from 'src/shared/helpers/functions/export_busboy';
import { GENDER_TYPE } from 'src/shared/domain/enums/gender_enum';
import { PRIVACY_TYPE } from 'src/shared/domain/enums/privacy_enum';
import { UpdateProfileUsecase } from './update_profile_usecase';
import { UserAPIGatewayDTO } from 'src/shared/infra/database/dtos/user_api_gateway_dto';
import { UpdateProfileViewmodel } from './update_profile_viewmodel';

export interface ProfileFormDataFields {
  name?: string;
  username?: string;
  nickname?: string;
  dateBirth?: number;
  gender?: GENDER_TYPE;
  phoneNumber?: string;
  privacy: PRIVACY_TYPE;
  biography?: string;
  linkInstagram?: string;
  linkTiktok?: string;
}

export class UpdateProfileController {
  constructor(private readonly usecase: UpdateProfileUsecase) {}

  async handle(
    formData: FormData<ProfileFormDataFields>,
    requesterUser: Record<string, any>
  ) {
    try {
      const userApiGateway = UserAPIGatewayDTO.fromAPIGateway(requesterUser);

      if (!userApiGateway) throw new ForbiddenAction('Usuário');

      let {
        name,
        username,
        nickname,
        dateBirth,
        gender,
        phoneNumber,
        privacy,
        biography,
        linkInstagram,
        linkTiktok,
      } = formData.fields;

      dateBirth = Number(dateBirth);

      const { backgroundImage, profileImage } = formData.files;

      let backgroundPhoto: ParsedFile | undefined;
      if (backgroundImage) {
        !Array.isArray(backgroundImage)
          ? (backgroundPhoto = backgroundImage)
          : (backgroundPhoto = backgroundImage[0]);
      }

      let profilePhoto: ParsedFile | undefined;
      if (profileImage) {
        !Array.isArray(profileImage)
          ? (profilePhoto = profileImage)
          : (profilePhoto = profileImage[0]);
      }

      const eventUpdated = await this.usecase.execute({
        userId: userApiGateway.userId,
        name,
        username,
        nickname,
        dateBirth,
        gender,
        phoneNumber,
        privacy,
        biography,
        linkInstagram,
        linkTiktok,
        profileImage: profilePhoto,
        backgroundImage: backgroundPhoto,
      });

      const viewmodel = new UpdateProfileViewmodel(eventUpdated);

      return new Created(viewmodel.toJSON());
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
