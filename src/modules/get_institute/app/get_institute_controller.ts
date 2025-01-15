import { IRequest } from 'src/shared/helpers/external_interfaces/external_interface';
import { GetInstituteUsecase } from './get_institute_usecase';
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
import { GetInstituteViewmodel } from './get_institute_viewmodel';
import { UserAPIGatewayDTO } from 'src/shared/infra/database/dtos/user_api_gateway_dto';

export interface GetInstituteByIdRequestBody {
  instituteId: string;
}

export class GetInstituteController {
  constructor(private readonly usecase: GetInstituteUsecase) {}

  async handle(req: IRequest) {
    try {
      const { instituteId } = req.data.query_params;

      if (!instituteId) {
        throw new MissingParameters('instituteId');
      }

      const institute = await this.usecase.execute(instituteId);
      const viewModel = new GetInstituteViewmodel(institute);
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
