import { IRequest } from "src/shared/helpers/external_interfaces/external_interface";
import { CreateReviewUseCase } from "./create_review_usecase";
import { BadRequest, Created, InternalServerError, NotFound, Unauthorized } from "src/shared/helpers/external_interfaces/http_codes";
import { ForbiddenAction, NoItemsFound } from "src/shared/helpers/errors/usecase_errors";
import { EntityError } from "src/shared/helpers/errors/domain_errors";
import { MissingParameters, WrongTypeParameters } from "src/shared/helpers/errors/controller_errors";
import { UserAPIGatewayDTO } from "src/shared/infra/dto/user_api_gateway_dto";

export class CreateReviewController {
    constructor(private readonly usecase: CreateReviewUseCase) {}

    async handle(req: IRequest, requesterUser: Record<string, any>) {
        try {
            const parsedUserApiGateway = UserAPIGatewayDTO.fromAPIGateway(requesterUser).getParsedData();
            if (!parsedUserApiGateway) throw new ForbiddenAction("usuário")

            const { star, review, reviewedAt, eventId } = req.data;

            if (!star) throw new MissingParameters("star");
            if (!review) throw new MissingParameters("review");
            if (!reviewedAt) throw new MissingParameters("reviewedAt");
            if (!eventId) throw new MissingParameters("eventId");

            if (typeof star !== "number") throw new WrongTypeParameters("star", "number", typeof star);
            if (typeof review !== "string") throw new WrongTypeParameters("review", "string", typeof review);
            if (typeof reviewedAt !== "number") throw new WrongTypeParameters("reviewedAt", "number", typeof reviewedAt);
            if (typeof eventId !== "string") throw new WrongTypeParameters("eventId", "string", typeof eventId);

            await this.usecase.execute(star, review, reviewedAt, eventId, parsedUserApiGateway.username);

            return new Created("Avaliação criada com sucesso");
        } catch (error: any) {
            if (
                error instanceof EntityError ||
                error instanceof MissingParameters ||
                error instanceof WrongTypeParameters
            ) {
                return new BadRequest(error.message)
            }
        
            if (error instanceof ForbiddenAction) {
                return new Unauthorized(error.message)
            }
        
            if (error instanceof NoItemsFound) {
                return new NotFound(error.message)
            }
        
            if (error instanceof Error) {
                return new InternalServerError(error.message)
            }
        }
    }
}