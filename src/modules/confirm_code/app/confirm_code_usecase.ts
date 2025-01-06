import { User } from "src/shared/domain/entities/user";
import { IAuthRepository } from "src/shared/domain/irepositories/auth_repository_interface";
import { EntityError } from "src/shared/helpers/errors/domain_errors";
import { NoItemsFound } from "src/shared/helpers/errors/usecase_errors";

export class ConfirmCodeUseCase {
  constructor(private readonly repo: IAuthRepository) {}

  async execute(email: string, code: string) {
    if (!User.validateEmail(email)) {
      throw new EntityError("email");
    }

    if (!code || code.length < 4 || code.length > 20) {
      throw new EntityError("code");
    }

    const result = await this.repo.confirmCode(
      email,
      code
    );

    if (!result) {
      throw new NoItemsFound("código");
    }

    const codeFromCognito = result.code
    const user = result.user

    return { message: "Código validado com sucesso!", user, codeFromCognito };
  }

  async getUser(username: string) {
    if (!User.validateUsername(username)) {
      throw new EntityError("username");
    }

    const result = await this.repo.findUserByUsername(username);

    if (!result) {
      throw new NoItemsFound("usuário");
    }

    return result;
  }
}
