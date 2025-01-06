import { User } from "src/shared/domain/entities/user";
import { IMailRepository } from "src/shared/domain/irepositories/mail_repository_interface";
import { IAuthRepository } from "src/shared/domain/irepositories/auth_repository_interface";
import { EntityError } from "src/shared/helpers/errors/domain_errors";
import { NoItemsFound } from "src/shared/helpers/errors/usecase_errors";

export class ResendCodeUseCase {
  constructor(
    private readonly userRepository: IAuthRepository,
    private readonly mailRepository: IMailRepository
  ) {}

  async execute(email: string) {
    if (!User.validateEmail(email)) {
      throw new EntityError("email");
    }

    const user = await this.userRepository.getUserByEmail(email);

    if (!user) {
      throw new NoItemsFound("email");
    }

    const code = await this.userRepository.resendCode(email);

    await this.mailRepository.sendMail(
      email,
      "Verificação de conta",
      `Seu novo código de verificação é: ${code}`,
      code
    );

    return code;
  }
}
