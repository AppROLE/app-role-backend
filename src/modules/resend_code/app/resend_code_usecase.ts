import { Profile } from "src/shared/domain/entities/profile";
import { IAuthRepository } from "src/shared/domain/repositories/auth_repository_interface";
import { EntityError } from "src/shared/helpers/errors/errors";
import { NoItemsFound } from "src/shared/helpers/errors/errors";

export class ResendCodeUseCase {
  constructor(
    private readonly userRepository: IAuthRepository,
  ) {}

  async execute(email: string) {
    if (!Profile.validateEmail(email)) {
      throw new EntityError("email");
    }

    const user = await this.userRepository.getUserByEmail(email);

    if (!user) {
      throw new NoItemsFound("email");
    }

    const code = await this.userRepository.resendCode(email);

    return code;
  }
}
