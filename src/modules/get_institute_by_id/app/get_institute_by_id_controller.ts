import { IRequest } from 'src/shared/helpers/external_interfaces/external_interface';
import { GetInstituteByIdUseCase } from './get_institute_by_id_usecase';
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
  NoItemsFound,
  WrongTypeParameters,
} from 'src/shared/helpers/errors/errors';
import { MissingParameters } from 'src/shared/helpers/errors/errors';
import { GetInstituteByIdViewModel } from './get_institute_by_id_viewmodel';
import { UserAPIGatewayDTO } from 'src/shared/infra/database/dtos/user_api_gateway_dto';

export interface GetInstituteByIdRequestBody {
  instituteId: string;
}

export class GetInstituteByIdController {
  constructor(private readonly usecase: GetInstituteByIdUseCase) {}

  async handle(req: IRequest, requesterUser: Record<string, any>) {
    try {
      const userApiGateway = UserAPIGatewayDTO.fromAPIGateway(requesterUser);

      if (!userApiGateway) throw new ForbiddenAction('Usuário');

      const { instituteId } = req.data.body;

      if (!instituteId) {
        throw new MissingParameters('instituteId');
      }

      const institute = await this.usecase.execute(instituteId);
      const viewModel = new GetInstituteByIdViewModel(institute);
      return new OK(viewModel.toJSON());
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
