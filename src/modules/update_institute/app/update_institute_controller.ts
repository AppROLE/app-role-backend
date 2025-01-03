import { IRequest } from "src/shared/helpers/external_interfaces/external_interface";
import { UpdateInstituteUseCase } from "./update_institute_usecase";
import {
  BadRequest,
  InternalServerError,
  NotFound,
  OK,
} from "src/shared/helpers/external_interfaces/http_codes";
import {
  MissingParameters,
  WrongTypeParameters,
} from "src/shared/helpers/errors/controller_errors";
import { INSTITUTE_TYPE } from "src/shared/domain/enums/institute_type_enum";
import { PARTNER_TYPE } from "src/shared/domain/enums/partner_type_enum";
import { UpdateInstituteViewModel } from "./update_institute_viewmodel";
import { EntityError } from "src/shared/helpers/errors/domain_errors";
import { NoItemsFound } from "src/shared/helpers/errors/usecase_errors";

export class UpdateInstituteController {
  constructor(private readonly usecase: UpdateInstituteUseCase) {}

  async handle(req: IRequest) {
    try {
      const {
        institute_id,
        description,
        institute_type,
        partner_type,
        name,
        address,
        phone,
      } = req.data;

      if (institute_id === undefined) {
        throw new MissingParameters("institute_id");
      }

      if (typeof institute_id !== "string") {
        throw new WrongTypeParameters(
          "institute_id",
          "string",
          typeof institute_id
        );
      }

      if (description !== undefined) {
        if (typeof description !== "string") {
          throw new WrongTypeParameters(
            "description",
            "string",
            typeof description
          );
        }
      }
      if (institute_type !== undefined) {
        if (typeof institute_type !== "string") {
          throw new WrongTypeParameters(
            "institute_type",
            "string",
            typeof institute_type
          );
        }
      }
      if (partner_type !== undefined) {
        if (typeof partner_type !== "string") {
          throw new WrongTypeParameters(
            "partner_type",
            "string",
            typeof partner_type
          );
        }
      }
      if (name !== undefined) {
        if (typeof name !== "string") {
          throw new WrongTypeParameters("name", "string", typeof name);
        }
      }

      if (address !== undefined) {
        if (typeof address !== "string") {
          throw new WrongTypeParameters("address", "string", typeof address);
        }
      }
      if (phone !== undefined) {
        if (typeof phone !== "string") {
          throw new WrongTypeParameters("phone", "string", typeof phone);
        }
      }

      await this.usecase.execute(
        institute_id,
        description,
        INSTITUTE_TYPE[institute_type as keyof typeof INSTITUTE_TYPE],
        PARTNER_TYPE[partner_type as keyof typeof PARTNER_TYPE],
        name,
        address,
        phone
      );

      const viewmodel = new UpdateInstituteViewModel(
        "Instituto atualizado com sucesso"
      );

      return new OK(viewmodel.toJSON());
    } catch (error: any) {
      if (
        error instanceof MissingParameters ||
        error instanceof WrongTypeParameters
      ) {
        return new BadRequest(error.message);
      }
      if (error instanceof EntityError) {
        return new BadRequest(error.message);
      }
      if (error instanceof NoItemsFound) {
        return new NotFound(error.message);
      }
      return new InternalServerError(
        `CreateEventController, Error on handle: ${error.message}`
      );
    } finally {
      await this.usecase.repository.closeSession();
    }
  }
}
