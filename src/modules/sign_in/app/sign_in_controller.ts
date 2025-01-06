import { SignInUseCase } from "./sign_in_usecase";
import {
  MissingParameters,
  WrongTypeParameters,
} from "src/shared/helpers/errors/controller_errors";

import { SignInViewModel } from "./sign_in_viewmodel";
import { IRequest } from "src/shared/helpers/external_interfaces/external_interface";
import {
  BadRequest,
  Forbidden,
  InternalServerError,
  NotFound,
  OK,
  Unauthorized,
} from "src/shared/helpers/external_interfaces/http_codes";
import { ForbiddenAction, NoItemsFound, UserNotConfirmed, UserSignUpNotFinished } from "src/shared/helpers/errors/usecase_errors";
import { EntityError } from "src/shared/helpers/errors/domain_errors";
import { InvalidCredentialsError } from "src/shared/helpers/errors/login_errors";

export class SignInController {
  constructor(private readonly usecase: SignInUseCase) {}

  async handle(request: IRequest) {
    const identifier = request.data.identifier;
    const password = request.data.password;
    const isWeb = request.data.isWeb;

    try {
      if (!identifier) {
        throw new MissingParameters("identifier");
      }

      if (typeof identifier !== "string") {
        throw new WrongTypeParameters("identifier", "string", typeof identifier);
      }

      if (!password) {
        throw new MissingParameters("password");
      }

      if (typeof password !== "string") {
        throw new WrongTypeParameters("password", "string", typeof password);
      }
      // if (isWeb && isWeb !== "true" && isWeb !== "false") {
      //   throw new WrongTypeParameters("isWeb", "boolean", typeof isWeb);
      // }

      const session = await this.usecase.execute(identifier, password, isWeb === "true") as { accessToken: string, idToken: string, refreshToken: string };
      const sessionViewModel = new SignInViewModel(
        session["accessToken"],
        session["idToken"],
        session["refreshToken"]
      );
      return new OK(sessionViewModel.toJSON());
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
      if (error instanceof UserNotConfirmed) {
        return new Forbidden(error.message);
      }
      if (error instanceof UserSignUpNotFinished) {
        return new BadRequest(error.message);
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
