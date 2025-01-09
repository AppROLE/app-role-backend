import { IRequest } from 'src/shared/helpers/external_interfaces/external_interface';
import { CreateReviewUseCase } from './create_review_usecase';
import {
  BadRequest,
  Conflict,
  Created,
  InternalServerError,
  NotFound,
  Unauthorized,
} from 'src/shared/helpers/external_interfaces/http_codes';
import {
  ConflictItems,
  ForbiddenAction,
  NoItemsFound,
} from 'src/shared/helpers/errors/errors';
import { EntityError } from 'src/shared/helpers/errors/errors';
import {
  MissingParameters,
  WrongTypeParameters,
} from 'src/shared/helpers/errors/errors';
import { UserAPIGatewayDTO } from 'src/shared/infra/database/dtos/user_api_gateway_dto';
import { CreateReviewViewModel } from './create_review_viewmodel';
import { ROLE_TYPE } from 'src/shared/domain/enums/role_type_enum';

export class CreateReviewController {
  constructor(private readonly usecase: CreateReviewUseCase) {}

  async handle(req: IRequest, requesterUser: Record<string, any>) {
    try {
      const userApiGateway = UserAPIGatewayDTO.fromAPIGateway(requesterUser);

      if (!userApiGateway) throw new ForbiddenAction('Usuário');

      if (userApiGateway.role !== ROLE_TYPE.COMMON) {
        throw new ForbiddenAction(
          'Usuário nao tem permissão para criar uma review'
        );
      }

      const { rating, review, eventId } = req.data.body;

      if (!rating) throw new MissingParameters('rating');
      if (!review) throw new MissingParameters('review');
      if (!eventId) throw new MissingParameters('eventId');

      if (typeof rating !== 'number')
        throw new WrongTypeParameters('rating', 'number', typeof rating);
      if (typeof review !== 'string')
        throw new WrongTypeParameters('review', 'string', typeof review);
      if (typeof eventId !== 'string')
        throw new WrongTypeParameters('eventId', 'string', typeof eventId);

      const reviewCreated = await this.usecase.execute(
        review,
        rating,
        eventId,
        userApiGateway.userId
      );

      const viewmodel = new CreateReviewViewModel(reviewCreated);
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
