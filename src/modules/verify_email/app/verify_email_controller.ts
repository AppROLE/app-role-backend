import {
  MissingParameters,
  WrongTypeParameters,
  NoItemsFound,
  EntityError,
  InvalidCredentialsError,
} from 'src/shared/helpers/errors/errors';
import { IRequest } from 'src/shared/helpers/external_interfaces/external_interface';
import {
  OK,
  BadRequest,
  NotFound,
  InternalServerError,
  Unauthorized,
} from 'src/shared/helpers/external_interfaces/http_codes';
import { VerifyEmailUsecase } from './verify_email_usecase';
import { VerifyEmailViewmodel } from './verify_email_viewmodel';

export interface ConfirmCodeRequestBody {
  email: string;
  code: string;
}

export class VerifyEmailController {
  constructor(private readonly usecase: VerifyEmailUsecase) {}

  async handle(request: IRequest<ConfirmCodeRequestBody>) {
    const { email, code } = request.data.body;

    try {
      if (!email) {
        throw new MissingParameters('email');
      }
      if (!code) {
        throw new MissingParameters('code');
      }

      if (typeof email !== 'string') {
        throw new WrongTypeParameters('email', 'string', typeof email);
      }

      if (typeof code !== 'string') {
        throw new WrongTypeParameters('code', 'string', typeof code);
      }

      await this.usecase.execute(email, code);
      const viewmodel = new VerifyEmailViewmodel(
        'Código validado com sucesso!'
      );
      return new OK(viewmodel.toJSON());
    } catch (error: any) {
      if (error instanceof InvalidCredentialsError) {
        return new Unauthorized(error.message);
      }
      if (error instanceof NoItemsFound) {
        return new NotFound(error.message);
      }
      if (error instanceof MissingParameters) {
        return new BadRequest(error.message);
      }
      if (error instanceof WrongTypeParameters) {
        return new BadRequest(error.message);
      }
      if (error instanceof EntityError) {
        return new BadRequest(error.message);
      }
      return new InternalServerError(error.message);
    }
  }
}
