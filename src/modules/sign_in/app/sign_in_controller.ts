import { SignInUseCase } from './sign_in_usecase';
import {
  MissingParameters,
  RequestUserToForgotPassword,
  UserNotRegistered,
  WrongTypeParameters,
} from 'src/shared/helpers/errors/errors';
import { IRequest } from 'src/shared/helpers/external_interfaces/external_interface';
import {
  BadRequest,
  Conflict,
  Forbidden,
  InternalServerError,
  NotFound,
  OK,
  Unauthorized,
} from 'src/shared/helpers/external_interfaces/http_codes';
import {
  ForbiddenAction,
  NoItemsFound,
  UserNotConfirmed,
  UserSignUpNotFinished,
} from 'src/shared/helpers/errors/errors';
import { EntityError } from 'src/shared/helpers/errors/errors';
import { InvalidCredentialsError } from 'src/shared/helpers/errors/errors';

export class SignInController {
  constructor(private readonly usecase: SignInUseCase) {}

  async handle(request: IRequest) {
    try {
      const { identifier, password } = request.data.body;
      if (!identifier) {
        throw new MissingParameters('identifier');
      }
      if (typeof identifier !== 'string') {
        throw new WrongTypeParameters(
          'identifier',
          'string',
          typeof identifier
        );
      }

      if (!password) {
        throw new MissingParameters('password');
      }
      if (typeof password !== 'string') {
        throw new WrongTypeParameters('password', 'string', typeof password);
      }

      const result = await this.usecase.execute(identifier, password);

      return new OK(result);
    } catch (error: any) {
      if (error instanceof NoItemsFound) {
        return new NotFound(error.message);
      }
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
      if (error instanceof InvalidCredentialsError) {
        return new BadRequest(error.message);
      }
      if (
        error instanceof UserNotConfirmed ||
        error instanceof UserSignUpNotFinished ||
        error instanceof RequestUserToForgotPassword ||
        error instanceof UserNotRegistered
      ) {
        return new Conflict(error.message);
      }

      if (error instanceof ForbiddenAction) {
        return new Unauthorized(error.message);
      }
      return new InternalServerError(
        `SignInController, Error on handle: ${error.message}`
      );
    }
  }
}
