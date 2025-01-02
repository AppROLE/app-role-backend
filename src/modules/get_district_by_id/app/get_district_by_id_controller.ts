import { IRequest } from "src/shared/helpers/external_interfaces/external_interface";
import { GetDistrictByIdUseCase } from "./get_district_by_id_usecase";
import {
  BadRequest,
  InternalServerError,
  NotFound,
  OK,
  Unauthorized,
} from "src/shared/helpers/external_interfaces/http_codes";
import {
  MissingParameters,
  WrongTypeParameters,
} from "src/shared/helpers/errors/controller_errors";
import {
  ForbiddenAction,
  NoItemsFound,
} from "src/shared/helpers/errors/usecase_errors";
import { EntityError } from "src/shared/helpers/errors/domain_errors";
import { GetDistrictByIdViewmodel } from "./get_district_by_id_viewmodel";

export class GetDistrictByIdController {
  constructor(private readonly usecase: GetDistrictByIdUseCase) {}

  async handle(request: IRequest, requesterUser: Record<string, any>) {
    try {
      if (!requesterUser) throw new ForbiddenAction("usuário");

      const { districtId } = request.data;

      console.log("RAW DISTRICT ID ", districtId);

      if (!districtId) throw new MissingParameters("nome");

      if (typeof districtId !== "string")
        throw new WrongTypeParameters(
          "id da zona",
          "string",
          typeof districtId
        );

      const district = await this.usecase.execute(districtId);

      const viewmodel = new GetDistrictByIdViewmodel(
        district.name,
        district.neighborhoods,
        district.districtId
      );

      return new OK(viewmodel.toJSON());
    } catch (error) {
      if (error instanceof ForbiddenAction) {
        return new Unauthorized(error.message);
      }

      if (error instanceof NoItemsFound) {
        return new NotFound(error.message);
      }

      if (
        error instanceof MissingParameters ||
        error instanceof WrongTypeParameters ||
        error instanceof EntityError
      ) {
        return new BadRequest(error.message);
      }
      if (error instanceof Error) {
        return new InternalServerError(error.message);
      }
    } finally {
      await this.usecase.repository.closeSession();
    }
  }
}
