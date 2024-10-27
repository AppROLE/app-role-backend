import { IEventRepository } from "src/shared/domain/irepositories/event_repository_interface";
import { IRequest } from "src/shared/helpers/external_interfaces/external_interface";
import { CreateEventUseCase } from "src/modules/create_event/app/create_event_usecase";
import { CreateEventViewModel } from "./create_event_viewmodel"; // Supondo que você tenha um viewmodel similar
import {
  MissingParameters,
  WrongTypeParameters,
} from "src/shared/helpers/errors/controller_errors";
import {
  BadRequest,
  Created,
  InternalServerError,
} from "src/shared/helpers/external_interfaces/http_codes";
import { EntityError } from "src/shared/helpers/errors/domain_errors";
import { STATUS } from "src/shared/domain/enums/status_enum";
import { MUSIC_TYPE } from "src/shared/domain/enums/music_type_enum";
import { FEATURE } from "src/shared/domain/enums/feature_enum";
import { PACKAGE_TYPE } from "src/shared/domain/enums/package_type_enum";
import { CATEGORY } from "src/shared/domain/enums/category_enum";
import { AGE_ENUM } from "src/shared/domain/enums/age_enum";

export class CreateEventController {
  constructor(private readonly usecase: CreateEventUseCase) {}

  async handle(req: IRequest) {
    try {
      let eventDate = req.data.eventDate;
      const {
        name,
        description,
        address,
        price,
        ageRange,
        districtId,
        instituteId,
        eventStatus,
        musicType,
        menuLink,
        galeryLink,
        bannerUrl,
        features,
        packageType,
        category,
        ticketUrl,
      } = req.data;

      const requiredParams = [
        "name",
        "description",
        "address",
        "price",
        "ageRange",
        "eventDate",
        "districtId",
        "instituteId",
        "eventStatus",
        "ticketUrl",
      ];

      for (const param of requiredParams) {
        if (req.data[param] === undefined) {
          throw new MissingParameters(param);
        }
      }

      if (typeof name !== "string") {
        throw new WrongTypeParameters("name", "string", typeof name);
      }
      if (typeof description !== "string") {
        throw new WrongTypeParameters(
          "description",
          "string",
          typeof description
        );
      }
      if (typeof address !== "string") {
        throw new WrongTypeParameters("address", "string", typeof address);
      }
      if (typeof price !== "number") {
        throw new WrongTypeParameters("price", "number", typeof price);
      }
      if (typeof ageRange !== "string") {
        throw new WrongTypeParameters("ageRange", "string", typeof ageRange);
      }
      if (typeof eventDate === "string") {
        eventDate = new Date(eventDate);
      }
      if (!(eventDate instanceof Date) || isNaN(eventDate.getTime())) {
        throw new WrongTypeParameters("eventDate", "Date", typeof eventDate);
      }

      if (typeof districtId !== "string") {
        throw new WrongTypeParameters(
          "districtId",
          "string",
          typeof districtId
        );
      }
      if (typeof instituteId !== "string") {
        throw new WrongTypeParameters(
          "instituteId",
          "string",
          typeof instituteId
        );
      }
      if (typeof eventStatus !== "string") {
        throw new WrongTypeParameters(
          "eventStatus",
          "string",
          typeof eventStatus
        );
      }

      const event = await this.usecase.execute({
        name,
        description,
        address,
        price,
        ageRange: Object.values(AGE_ENUM).includes(ageRange as AGE_ENUM) ? (ageRange as AGE_ENUM) : AGE_ENUM.DEFAULT, // Replace 'DEFAULT' with an appropriate default value from AGE_ENUM
        eventDate,
        districtId,
        instituteId,
        eventStatus: STATUS[eventStatus as keyof typeof STATUS],
        musicType: musicType
          ? (musicType as string[]).map(
              (type) => MUSIC_TYPE[type as keyof typeof MUSIC_TYPE]
            )
          : undefined,
        menuLink: typeof menuLink === "string" ? menuLink : undefined,
        galeryLink: typeof galeryLink === "string" ? [galeryLink] : undefined,
        bannerUrl: typeof bannerUrl === "string" ? bannerUrl : undefined,
        features: features
          ? (features as string[]).map(
              (feature) => FEATURE[feature as keyof typeof FEATURE]
            )
          : undefined,
        packageType: packageType
          ? (packageType as string[]).map(
              (pkg) => PACKAGE_TYPE[pkg as keyof typeof PACKAGE_TYPE]
            )
          : undefined,
        category: category
          ? CATEGORY[category as keyof typeof CATEGORY]
          : undefined,
        ticketUrl: typeof ticketUrl === "string" ? ticketUrl : undefined,
      });

      const eventId = event.getEventId; // Replace 'defaultEventId' with an appropriate default value
      const viewmodel = new CreateEventViewModel("Evento criado com sucesso", eventId);

      return new Created(viewmodel.toJSON());
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
      if (error instanceof Error) {
        return new InternalServerError(
          `CreateEventController, Error on handle: ${error.message}`
        );
      }
    }
  }
}
