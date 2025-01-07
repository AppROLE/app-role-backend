import { Profile } from "src/shared/domain/entities/profile";
import { EntityError } from "src/shared/helpers/errors/domain_errors";
import { NoItemsFound } from "src/shared/helpers/errors/usecase_errors";
import { IAuthRepository } from "src/shared/domain/irepositories/auth_repository_interface";
import { IMailRepository } from "src/shared/domain/irepositories/mail_repository_interface";
import { generateConfirmationCode } from "src/shared/utils/generate_confirmation_code";

export class ForgotPasswordUseCase {
  constructor(
    private readonly repo: IAuthRepository,
    private readonly mailRepo: IMailRepository
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
    await this.mailRepo.sendMail(
      email,
      "Recuperação de Senha",
      `Codigo de recuperacao: ${code}`,
      code
    );

    return { message: "E-mail de recuperação enviado com sucesso" };
  }
}
