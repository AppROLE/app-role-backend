import { IRequest } from "src/shared/helpers/external_interfaces/external_interface";
import { CreateReviewUseCase } from "./create_review_usecase";
import {
  BadRequest,
  Conflict,
  Created,
  InternalServerError,
  NotFound,
  Unauthorized,
} from "src/shared/helpers/external_interfaces/http_codes";
import {
  ConflictItems,
  ForbiddenAction,
  NoItemsFound,
} from "src/shared/helpers/errors/errors";
import { EntityError } from "src/shared/helpers/errors/errors";
import {
  MissingParameters,
  WrongTypeParameters,
} from "src/shared/helpers/errors/errors";
import { UserAPIGatewayDTO } from "src/shared/infra/database/dtos/user_api_gateway_dto";
import { CreateReviewViewModel } from "./create_review_viewmodel";

export class CreateReviewController {
  constructor(private readonly usecase: CreateReviewUseCase) {}

  async handle(req: IRequest, requesterUser: Record<string, any>) {
    try {
      const parsedUserApiGateway =
        UserAPIGatewayDTO.fromAPIGateway(requesterUser).getParsedData();
      if (!parsedUserApiGateway) throw new ForbiddenAction("Usuário não encontrado");

      if(!parsedUserApiGateway.username) throw new ForbiddenAction("Usuário não encontrado");

      const { rating, review, createdAt, eventId, photoUrl, name } = req.data;

      if (!rating) throw new MissingParameters("rating");
      if (!review) throw new MissingParameters("review");
      if (!createdAt) throw new MissingParameters("createdAt");
      if (!eventId) throw new MissingParameters("eventId");
      if (!photoUrl) throw new MissingParameters("photoUrl");
      if (!name) throw new MissingParameters("name");

      if (typeof rating !== "number")
        throw new WrongTypeParameters("rating", "number", typeof rating);
      if (typeof review !== "string")
        throw new WrongTypeParameters("review", "string", typeof review);
      if (typeof createdAt !== "number")
        throw new WrongTypeParameters(
          "createdAt",
          "number",
          typeof createdAt
        );
      if (typeof eventId !== "string")
        throw new WrongTypeParameters("eventId", "string", typeof eventId);
      if (typeof photoUrl !== "string")
        throw new WrongTypeParameters("photoUrl", "string", typeof photoUrl);
      if (typeof name !== "string")
        throw new WrongTypeParameters("name", "string", typeof name);

      await this.usecase.execute(
        rating,
        review,
        createdAt,
        eventId,
        parsedUserApiGateway.username,
        name.split(" ")[0],
        photoUrl
      );

      const viewmodel = new CreateReviewViewModel(
        "Avaliação criada com sucesso"
      );
      return new Created(viewmodel);
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
