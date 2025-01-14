import { IProfileRepository } from 'src/shared/domain/repositories/profile_repository_interface';
import { FindPersonReturn } from 'src/shared/helpers/types/find_person_return_type';
import { Repository } from 'src/shared/infra/database/repositories/repository';

export class SearchProfilesUsecase {
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

  execute(searchTerm: string): Promise<FindPersonReturn[]> {
    const profiles = this.profile_repo!.findProfile(searchTerm);
    return profiles;
  }
}
