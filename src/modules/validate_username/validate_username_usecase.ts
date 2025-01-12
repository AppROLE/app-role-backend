import { IProfileRepository } from "src/shared/domain/repositories/profile_repository_interface";
import { Repository } from "src/shared/infra/database/repositories/repository";

export class ValidateUsenameUsecase {
  repository: Repository;
  private profile_repo?: IProfileRepository;

  constructor() {
    this.repository = new Repository({
      profile_repo: true,

    });
  }

  async connect() {
    await this.repository.connectRepository();
    this.profile_repo = this.repository.profile_repo;

    if (!this.profile_repo)
      throw new Error('Expected to have an instance of the profile repository');
  }

  async execute(username: string): Promise<boolean> {
    const profile = await this.profile_repo!.getByUsername(username);

    return !profile;
  }
}