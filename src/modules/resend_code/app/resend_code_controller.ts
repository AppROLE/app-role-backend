import {
  EntityError,
  MissingParameters,
  NoItemsFound,
  WrongTypeParameters,
} from 'src/shared/helpers/errors/errors';
import { IRequest } from 'src/shared/helpers/external_interfaces/external_interface';
import {
  BadRequest,
  InternalServerError,
  NotFound,
  OK,
} from 'src/shared/helpers/external_interfaces/http_codes';
import { ResendCodeUseCase } from './resend_code_usecase';

export interface ResendCodeRequestBody {
  email: string;
}

export class ResendCodeController {
  constructor(private readonly usecase: ResendCodeUseCase) {}

  async handle(request: IRequest<ResendCodeRequestBody>) {
    const { email } = request.data.body;

    try {
      if (!email) {
        throw new MissingParameters('email');
      }

      if (typeof email !== 'string') {
        throw new WrongTypeParameters('email', 'string', typeof email);
      }

      await this.usecase.execute(email);

      return new OK({
        message: 'Um novo código foi enviado para o seu e-mail!',
      });
    } catch (error: any) {
      if (
        error instanceof MissingParameters ||
        error instanceof WrongTypeParameters
      ) {
        return new BadRequest(error.message);
      }
      if (error instanceof NoItemsFound) {
        return new NotFound(error.message);
      }
      if (error instanceof EntityError) {
        return new BadRequest(error.message);
      }
      if (error instanceof Error) {
        return new InternalServerError(
          `ResendCodeController, Error on handle: ${error.message}`
        );
      }
    }
  }
}
