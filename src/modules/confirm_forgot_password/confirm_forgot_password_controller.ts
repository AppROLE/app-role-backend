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
import { ConfirmForgotPasswordUseCase } from './confirm_forgot_password_usecase';

export class ConfirmForgotPasswordController {
  constructor(private readonly usecase: ConfirmForgotPasswordUseCase) {}

  async handle(request: IRequest) {
    try {
      const { email, newPassword, code } = request.data.body;
      if (!email) {
        throw new MissingParameters('email');
      }
      if (typeof email !== 'string') {
        throw new WrongTypeParameters('email', 'string', typeof email);
      }

      if (!newPassword) {
        throw new MissingParameters('newPassword');
      }
      if (typeof newPassword !== 'string') {
        throw new WrongTypeParameters(
          'newPassword',
          'string',
          typeof newPassword
        );
      }

      if (!code) {
        throw new MissingParameters('code');
      }
      if (typeof code !== 'string') {
        throw new WrongTypeParameters('code', 'string', typeof code);
      }

      await this.usecase.execute(email, newPassword, code);
      return new OK({
        message: 'Senha alterada com sucesso',
      });
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
