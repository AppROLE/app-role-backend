import { IAuthRepository } from "src/shared/domain/irepositories/auth_repository_interface";
import { Profile } from "src/shared/domain/entities/profile";
import { EntityError } from "src/shared/helpers/errors/domain_errors";
import { InvalidCredentialsError } from "src/shared/helpers/errors/login_errors";
import { ROLE_TYPE } from "src/shared/domain/enums/role_type_enum";
import {
  ForbiddenAction,
  UserNotConfirmed,
  UserSignUpNotFinished,
} from "src/shared/helpers/errors/usecase_errors";
import { IUserRepository } from "src/shared/domain/irepositories/user_repository_interface";

export class SignInUseCase {
  constructor(
    private readonly repo: IAuthRepository,
    private readonly userRepo: IUserRepository
  ) {}

  async execute(indentifier: string, password: string, isWeb: boolean) {
    let email = Profile.validateEmail(indentifier) ? indentifier : null;
    let username = !email ? indentifier : null;

    if (!email && !username) {
      throw new EntityError("identificator");
    }

    const emailRegex = new RegExp(
      /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/
    );
    let session;
    let user;
    if (email) {
      user = await this.repo.getUserByEmail(email);
      if (!user) {
        throw new InvalidCredentialsError();
      }
      if (user.userEmailVerified === false) throw new UserNotConfirmed();
      const isOAuth = await this.userRepo.validateIsOAuthUser(email);
      if (isOAuth) {
        throw new ForbiddenAction("usuário");
      }
      session = await this.repo.signIn(email, password);
    } else {
      if (username) {
        user = await this.repo.findUserByUsername(username);
        if (!user) {
          throw new InvalidCredentialsError();
        }
        const isOAuth = await this.userRepo.validateIsOAuthUser(user.userEmail);
        if (isOAuth) {
          throw new ForbiddenAction("usuário");
        }
        session = await this.repo.signIn(username, password);
      }
    }

    if (!session) {
      throw new InvalidCredentialsError();
    }

    if (session.accessToken && emailRegex.test(user?.userUsername as string))
      throw new UserSignUpNotFinished();

    // if (isWeb && user?.role !== ROLE_TYPE.OWNER) {
    //   throw new ForbiddenAction('tipo de usuário');
    // }
    return session;
  }
}
