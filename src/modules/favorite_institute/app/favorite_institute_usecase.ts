import { IUserRepository } from "src/shared/domain/repositories/user_repository_interface";
import { EntityError } from "src/shared/helpers/errors/domain_errors";
import { Repository } from "src/shared/infra/database/repositories/repository";

export class FavoriteInstituteUseCase {
  repository: Repository;
  private user_repo?: IUserRepository;

  constructor() {
    this.repository = new Repository({
      user_repo: true,
    });
  }

  async connect() {
    await this.repository.connectRepository();
    this.user_repo = this.repository.user_repo;

    if (!this.user_repo)
      throw new Error('Expected to have an instance of the user repository');
  }

  async execute(username: string, instituteId: string): Promise<void> {
    if (!username) throw new EntityError("Usuário não encontrado");
    if (!instituteId) throw new EntityError("Instituto não encontrado");

    await this.user_repo!.favoriteInstitute(username, instituteId);
  }
}
