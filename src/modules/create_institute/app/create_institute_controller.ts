import {
  IRequest,
  IResponse,
} from "src/shared/helpers/external_interfaces/external_interface";
import { CreateInstituteUseCase } from "./create_institute_usecase";
import {
  INSTITUTE_TYPE,
  toEnum,
} from "src/shared/domain/enums/institute_type_enum";
import {
  MissingParameters,
  WrongTypeParameters,
} from "src/shared/helpers/errors/controller_errors";
import { CreateInstituteViewModel } from "./create_institute_viewmodel";
import {
  BadRequest,
  Created,
  InternalServerError,
} from "src/shared/helpers/external_interfaces/http_codes";
import { EntityError } from "src/shared/helpers/errors/domain_errors";
import { PARTNER_TYPE } from "src/shared/domain/enums/partner_type_enum";
import { DuplicatedItem } from "src/shared/helpers/errors/usecase_errors";

export class CreateInstituteController {
  constructor(private readonly usecase: CreateInstituteUseCase) {}

  async handle(req: IRequest) {
    try {
      const {
        description,
        institute_type,
        partner_type,
        name,
        latitude,
        longitude,
        address,
        neighborhood,
        city,
        state,
        cep,
        price,
        phone,
      } = req.data;

      const requiredParams = [
        "description",
        "institute_type",
        "partner_type",
        "name",
      ];

      for (const param of requiredParams) {
        if (req.data[param] === undefined) {
          throw new MissingParameters(param);
        }
      }

      if (typeof description !== "string") {
        throw new WrongTypeParameters(
          "description",
          "string",
          typeof description
        );
      }
      if (typeof institute_type !== "string") {
        throw new WrongTypeParameters(
          "institute_type",
          "string",
          typeof institute_type
        );
      }
      if (typeof partner_type !== "string") {
        throw new WrongTypeParameters(
          "partner_type",
          "string",
          typeof partner_type
        );
      }
      if (typeof name !== "string") {
        throw new WrongTypeParameters("name", "string", typeof name);
      }

      if (typeof latitude !== "number") {
        throw new WrongTypeParameters("latitude", "number", typeof latitude);
      }
      if (typeof longitude !== "number") {
        throw new WrongTypeParameters("longitude", "number", typeof longitude);
      }
      if (typeof address !== "string") {
        throw new WrongTypeParameters("address", "string", typeof address);
      }
      if (typeof neighborhood !== "string") {
        throw new WrongTypeParameters(
          "neighborhood",
          "string",
          typeof neighborhood
        );
      }
      if (typeof city !== "string") {
        throw new WrongTypeParameters("city", "string", typeof city);
      }
      if (typeof state !== "string") {
        throw new WrongTypeParameters("state", "string", typeof state);
      }
      if (typeof cep !== "string") {
        throw new WrongTypeParameters("cep", "string", typeof cep);
      }

      if (price !== undefined) {
        if (typeof price !== "number") {
          throw new WrongTypeParameters("price", "number", typeof price);
        }
      }

      if (phone !== undefined) {
        if (typeof phone !== "string") {
          throw new WrongTypeParameters("phone", "string", typeof phone);
        }
      }

      const instituteId = await this.usecase.execute({
        description: description,
        institute_type:
          INSTITUTE_TYPE[institute_type as keyof typeof INSTITUTE_TYPE],
        name: name,
        partner_type: PARTNER_TYPE[partner_type as keyof typeof PARTNER_TYPE],
        phone: phone,
        location: {
          latitude: latitude,
          longitude: longitude,
          address: address,
          neighborhood: neighborhood,
          city: city,
          state: state,
          cep: cep,
        },
        price: price,
      });

      const viewmodel = new CreateInstituteViewModel(
        "Instituição criada com sucesso",
        String(instituteId)
      );
      return new Created(viewmodel.toJSON());
    } catch (error) {
      if (
        error instanceof MissingParameters ||
        error instanceof WrongTypeParameters
      ) {
        return new BadRequest(error.message);
      }
      if (error instanceof EntityError) {
        return new BadRequest(error.message);
      }
      if (error instanceof DuplicatedItem) {
        return new BadRequest(error.message);
      }
      if (error instanceof Error) {
        return new InternalServerError(
          `CreateEventController, Error on handle: ${error.message}`
        );
      }
    } finally {
      await this.usecase.repository.closeSession();
    }
  }
}
