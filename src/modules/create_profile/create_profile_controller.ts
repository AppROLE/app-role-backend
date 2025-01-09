import {
  ForbiddenAction,
  MissingParameters,
  NoItemsFound,
  WrongTypeParameters,
} from 'src/shared/helpers/errors/errors';
import {
  BadRequest,
  Created,
  InternalServerError,
  NotFound,
  Unauthorized,
} from 'src/shared/helpers/external_interfaces/http_codes';
import { EntityError } from 'src/shared/helpers/errors/errors';
import { PARTNER_TYPE } from 'src/shared/domain/enums/partner_type_enum';
import { DuplicatedItem } from 'src/shared/helpers/errors/errors';
import { UserAPIGatewayDTO } from 'src/shared/infra/database/dtos/user_api_gateway_dto';
import { ROLE_TYPE } from 'src/shared/domain/enums/role_type_enum';
import { CreateProfileUsecase } from './create_profile_usecase';
import { CreateProfileViewmodel } from './create_profile_viewmodel';

export class CreateProfileController {
  constructor(private readonly usecase: CreateProfileUsecase) {}

  async handle(
    formData: Record<string, any>,
    requesterUser: Record<string, any>
  ) {
    try {
      const userApiGateway = UserAPIGatewayDTO.fromAPIGateway(requesterUser);

      if (!userApiGateway) throw new ForbiddenAction('Usuário');

      const { username, nickname, acceptedTerms } = formData.fields;

      const profilePhoto = formData.files['profilePhoto'];

      if (profilePhoto === undefined) {
        throw new MissingParameters('profilePhoto');
      }

      if (typeof username !== 'string') {
        throw new WrongTypeParameters('username', 'string', typeof username);
      }

      if (typeof nickname !== 'string') {
        throw new WrongTypeParameters('nickname', 'string', typeof nickname);
      }

      if (typeof acceptedTerms !== 'boolean') {
        throw new WrongTypeParameters(
          'acceptedTerms',
          'boolean',
          typeof acceptedTerms
        );
      }

      const profile = await this.usecase.execute(
        userApiGateway.userId,
        userApiGateway.name,
        username,
        nickname,
        userApiGateway.email,
        acceptedTerms,
        {
          image: profilePhoto.image,
          mimetype: profilePhoto.mimetype,
        }
      );

      const viewmodel = new CreateProfileViewmodel(profile);

      return new Created(viewmodel.toJSON());
    } catch (error: any) {
      if (
        error instanceof EntityError ||
        error instanceof MissingParameters ||
        error instanceof WrongTypeParameters
      ) {
        return new BadRequest(error.message);
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
