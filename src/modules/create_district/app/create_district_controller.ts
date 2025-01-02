import { IRequest } from "src/shared/helpers/external_interfaces/external_interface";
import { CreateDistrictUseCase } from "./create_district_usecase";
import {
  BadRequest,
  Created,
  InternalServerError,
  Unauthorized,
} from "src/shared/helpers/external_interfaces/http_codes";
import {
  MissingParameters,
  WrongTypeParameters,
} from "src/shared/helpers/errors/controller_errors";
import { ForbiddenAction } from "src/shared/helpers/errors/usecase_errors";
import { EntityError } from "src/shared/helpers/errors/domain_errors";
import { CreateDistrictViewmodel } from "./create_district_viewmodel";

export class CreateDistrictController {
  constructor(private readonly usecase: CreateDistrictUseCase) {}

  async handle(request: IRequest, requesterUser: Record<string, any>) {
    try {
      if (!requesterUser) throw new ForbiddenAction("usuário");

      const { name, neighborhoods } = request.data;

      if (!name) throw new MissingParameters("nome");
      if (!neighborhoods) throw new MissingParameters("bairros");

      if (typeof name !== "string")
        throw new WrongTypeParameters("nome", "string", typeof name);
      if (!Array.isArray(neighborhoods))
        throw new WrongTypeParameters("bairros", "array", typeof neighborhoods);
      neighborhoods.forEach((neighborhood) => {
        if (typeof neighborhood !== "string")
          throw new WrongTypeParameters(
            "bairros",
            "string",
            typeof neighborhood
          );
      });

      const district = await this.usecase.execute(name, neighborhoods);

      const viewmodel = new CreateDistrictViewmodel(
        district.name,
        district.neighborhoods,
        district.districtId
      );

      return new Created(viewmodel.toJSON());
    } catch (error) {
      if (error instanceof ForbiddenAction) {
        return new Unauthorized(error.message);
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
