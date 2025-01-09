import {
  MissingParameters,
  WrongTypeParameters,
} from 'src/shared/helpers/errors/errors';
import {
  BadRequest,
  InternalServerError,
} from 'src/shared/helpers/external_interfaces/http_codes';
import { EntityError } from 'src/shared/helpers/errors/errors';
import { IRequest } from 'src/shared/helpers/external_interfaces/external_interface';
import {
  NotFound,
  OK,
  Unauthorized,
} from 'src/shared/helpers/external_interfaces/http_codes';
import {
  ConflictItems,
  ForbiddenAction,
  NoItemsFound,
} from 'src/shared/helpers/errors/errors';
import { RefreshTokenUsecase } from './refresh_token_usecase';

export class RefreshTokenController {
  constructor(private readonly usecase: RefreshTokenUsecase) {}

  async handle(request: IRequest) {
    const refreshToken = request.data.body.refreshToken;

    try {
      if (!refreshToken) {
        throw new MissingParameters('email');
      }

      if (typeof refreshToken !== 'string') {
        throw new WrongTypeParameters(
          'refreshToken',
          'string',
          typeof refreshToken
        );
      }

      const result = await this.usecase.execute(refreshToken);

      return new OK(result);
    } catch (error: any) {
      if (error instanceof NoItemsFound) {
        return new NotFound(error.message);
      }
      if (error instanceof MissingParameters) {
        return new BadRequest(error.message);
      }
      if (error instanceof WrongTypeParameters) {
        return new BadRequest(error.message);
      }
      if (error instanceof ConflictItems) {
        return new BadRequest(error.message);
      }
      if (error instanceof EntityError) {
        return new BadRequest(error.message);
      }
      if (error instanceof ForbiddenAction) {
        return new Unauthorized(error.message as any);
      }
      if (error instanceof Error) {
        return new InternalServerError(error.message);
      }
    }
  }
}
