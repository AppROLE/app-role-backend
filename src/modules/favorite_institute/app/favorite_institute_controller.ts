import { IRequest } from 'src/shared/helpers/external_interfaces/external_interface';
import { FavoriteInstituteUsecase } from './favorite_institute_usecase';
import {
  BadRequest,
  InternalServerError,
  NotFound,
  OK,
  Unauthorized,
} from 'src/shared/helpers/external_interfaces/http_codes';
import { EntityError } from 'src/shared/helpers/errors/errors';
import {
  MissingParameters,
  WrongTypeParameters,
} from 'src/shared/helpers/errors/errors';
import {
  ForbiddenAction,
  NoItemsFound,
} from 'src/shared/helpers/errors/errors';
import { UserAPIGatewayDTO } from 'src/shared/infra/database/dtos/user_api_gateway_dto';

export class FavoriteInstituteController {
  constructor(private readonly usecase: FavoriteInstituteUsecase) {}

  async handle(req: IRequest, requesterUser: Record<string, any>) {
    try {
      const parsedUserApiGateway =
        UserAPIGatewayDTO.fromAPIGateway(requesterUser).getParsedData();

      if (!parsedUserApiGateway) throw new ForbiddenAction('usuário');

      const { instituteId } = req.data.body;

      if (!instituteId) throw new MissingParameters('instituteId');

      if (typeof instituteId !== 'string')
        throw new WrongTypeParameters(
          'instituteId',
          'string',
          typeof instituteId
        );

      await this.usecase.execute(parsedUserApiGateway.userId, instituteId);

      return new OK({ message: 'Instituto favoritado com sucesso' });
    } catch (error: any) {
      if (error instanceof EntityError) {
        return new BadRequest(error.message);
      }
      if (error instanceof ForbiddenAction) {
        return new Unauthorized(error.message);
      }
      if (error instanceof MissingParameters) {
        return new BadRequest(error.message);
      }
      if (error instanceof WrongTypeParameters) {
        return new BadRequest(error.message);
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
