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
} from "src/shared/helpers/errors/usecase_errors";
import { EntityError } from "src/shared/helpers/errors/domain_errors";
import {
  MissingParameters,
  WrongTypeParameters,
} from "src/shared/helpers/errors/controller_errors";
import { UserAPIGatewayDTO } from "src/shared/infra/dto/user_api_gateway_dto";
import { CreateReviewViewModel } from "./create_review_viewmodel";

export class CreateReviewController {
  constructor(private readonly usecase: CreateReviewUseCase) {}

  async handle(req: IRequest, requesterUser: Record<string, any>) {
    try {
      const parsedUserApiGateway =
        UserAPIGatewayDTO.fromAPIGateway(requesterUser).getParsedData();
      if (!parsedUserApiGateway) throw new ForbiddenAction("usuário");

      const { star, review, reviewedAt, eventId, photoUrl, name } = req.data;

      if (!star) throw new MissingParameters("star");
      if (!review) throw new MissingParameters("review");
      if (!reviewedAt) throw new MissingParameters("reviewedAt");
      if (!eventId) throw new MissingParameters("eventId");
      if (!photoUrl) throw new MissingParameters("photoUrl");
      if (!name) throw new MissingParameters("name");

      if (typeof star !== "number")
        throw new WrongTypeParameters("star", "number", typeof star);
      if (typeof review !== "string")
        throw new WrongTypeParameters("review", "string", typeof review);
      if (typeof reviewedAt !== "number")
        throw new WrongTypeParameters(
          "reviewedAt",
          "number",
          typeof reviewedAt
        );
      if (typeof eventId !== "string")
        throw new WrongTypeParameters("eventId", "string", typeof eventId);
      if (typeof photoUrl !== "string")
        throw new WrongTypeParameters("photoUrl", "string", typeof photoUrl);
      if (typeof name !== "string")
        throw new WrongTypeParameters("name", "string", typeof name);

      await this.usecase.execute(
        star,
        review,
        reviewedAt,
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
