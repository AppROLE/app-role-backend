import { Profile } from "src/shared/domain/entities/profile";
import { EntityError } from "src/shared/helpers/errors/errors";
import { NoItemsFound } from "src/shared/helpers/errors/errors";
import { IAuthRepository } from "src/shared/domain/repositories/auth_repository_interface";
import { generateConfirmationCode } from "src/shared/utils/generate_confirmation_code";

export class ForgotPasswordUseCase {
  constructor(
    private readonly repo: IAuthRepository,
  ) {}

  async execute(email: string) {
    if (!Profile.validateEmail(email)) {
      throw new EntityError("email");
    }

    const user = await this.repo.getUserByEmail(email);
    if (!user) {
      throw new NoItemsFound("esse email");
    }

    const code = generateConfirmationCode();

    await this.repo.forgotPassword(email, code);

    return { message: "E-mail de recuperação enviado com sucesso" };
  }
}
