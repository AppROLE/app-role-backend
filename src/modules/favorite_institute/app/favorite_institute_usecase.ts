import { IUserRepository } from "src/shared/domain/repositories/user_repository_interface";
import { EntityError } from "src/shared/helpers/errors/domain_errors";
import { Repository } from "src/shared/infra/database/repositories/repository";

export class FavoriteInstituteUseCase {
  repository: Repository;
  private readonly user_repo: IUserRepository;

  constructor() {
    this.repository = new Repository({
      event_repo: true,
      presence_repo: true,
    });
    this.user_repo = this.repository.user_repo!;
  }

  async execute(username: string, instituteId: string): Promise<void> {
    if (!username) throw new EntityError("Usuário não encontrado");
    if (!instituteId) throw new EntityError("Instituto não encontrado");

    await this.user_repo.favoriteInstitute(username, instituteId);
  }
}
