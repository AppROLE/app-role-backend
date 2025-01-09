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
import { DeleteInstituteViewModel } from './delete_institute_viewmodel';
import { DeleteInstituteUsecase } from './delete_institute_usecase';
import { UserAPIGatewayDTO } from 'src/shared/infra/database/dtos/user_api_gateway_dto';
import { ROLE_TYPE } from 'src/shared/domain/enums/role_type_enum';

export class DeleteInstituteController {
  constructor(private readonly usecase: DeleteInstituteUsecase) {}

  async handle(
    req: IRequest,
    requesterUser: Record<string, any>
  ): Promise<any> {
    try {
      const userApiGateway = UserAPIGatewayDTO.fromAPIGateway(requesterUser);

      if (!userApiGateway) throw new ForbiddenAction('Usuário');

      if (userApiGateway.role !== ROLE_TYPE.OWNER) {
        throw new ForbiddenAction(
          'Usuário nao tem permissão para excluir um instituto'
        );
      }

      const { instituteId } = req.data.body;

      await this.usecase.execute(instituteId as string);

      const viewmodel = new DeleteInstituteViewModel(
        'Instituto deletado com sucesso'
      );
      return new OK(viewmodel.toJSON());
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
