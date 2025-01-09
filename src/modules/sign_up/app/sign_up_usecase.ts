import { Profile } from "src/shared/domain/entities/profile";
import { IAuthRepository } from "src/shared/domain/repositories/auth_repository_interface";
import { EntityError } from "src/shared/helpers/errors/errors";
import {
  DuplicatedItem,
  RequestUserToForgotPassword,
  UserAlreadyExists,
  UserNotConfirmed,
} from "src/shared/helpers/errors/errors";
import { Validations } from "src/shared/helpers/utils/validations";
import { Repository } from "src/shared/infra/database/repositories/repository";

export class SignUpUseCase {
  repository: Repository;
  private auth_repo?: IAuthRepository;

  constructor() {
    this.repository = new Repository({
      auth_repo: true,
    });
  }

  async connect() {
    await this.repository.connectRepository();
    this.auth_repo = this.repository.auth_repo;

    if (!this.auth_repo)
      throw new Error("Expected to have an instance of the auth repository");
  }

  async execute(name: string, email: string, password: string) {
    if (Validations.validateEmail(email) === false) {
      throw new EntityError("email");
    }

    if (Validations.validateName(name) === false) {
      throw new EntityError("name");
    }

    if (Validations.validatePassword(password) === false) {
      throw new EntityError("password");
    }

    const userAlreadyExists = await this.auth_repo!.getUserByEmail(email);

    if (userAlreadyExists) {
      throw new UserNotConfirmed();
    }

    const createdUser = await this.auth_repo!.signUp(name, email, password);

    return createdUser;
  }
}
