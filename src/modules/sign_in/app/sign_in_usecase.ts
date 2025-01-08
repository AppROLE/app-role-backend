import { Profile } from "src/shared/domain/entities/profile";
import { EntityError } from "src/shared/helpers/errors/errors";
import { InvalidCredentialsError } from "src/shared/helpers/errors/errors";
import { ROLE_TYPE } from "src/shared/domain/enums/role_type_enum";
import {
  ForbiddenAction,
  UserNotConfirmed,
  UserSignUpNotFinished,
} from "src/shared/helpers/errors/errors";
import { Validations } from "src/shared/helpers/utils/validations";
import { IProfileRepository } from "src/shared/domain/repositories/profile_repository_interface";
import { IAuthRepository } from "src/shared/domain/repositories/auth_repository_interface";
import { Repository } from "src/shared/infra/database/repositories/repository";

export class SignInUseCase {
  repository: Repository;
  private auth_repo?: IAuthRepository;
  private profile_repo?: IProfileRepository;

  constructor() {
    this.repository = new Repository({
      auth_repo: true,
      profile_repo: true,
    });
  }

  async connect() {
    await this.repository.connectRepository();
    this.auth_repo = this.repository.auth_repo;
    this.profile_repo = this.repository.profile_repo;

    if (!this.auth_repo)
      throw new Error('Expected to have an instance of the auth repository');

    if (!this.profile_repo)
      throw new Error('Expected to have an instance of the user repository');
  }

  async execute(email: string, password: string) {
    if (Validations.validateEmail(email)) {
      throw new EntityError("email");
    }

    if (Validations.validatePassword(password)) {
      throw new EntityError("password");
    }

    const result = await this.auth_repo?.signIn(email, password);

    if (!result) {
      throw new InvalidCredentialsError();
    }

    const user = await this.profile_repo?.(result.user_id);
  }
}
