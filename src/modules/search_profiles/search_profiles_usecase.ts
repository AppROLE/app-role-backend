import { IProfileRepository } from 'src/shared/domain/repositories/profile_repository_interface';
import { NoItemsFound } from 'src/shared/helpers/errors/errors';
import { PaginationReturn } from 'src/shared/helpers/types/event_pagination';
import { ProfileCardReturn } from 'src/shared/helpers/types/profile_card_return';
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

  async execute(
    searchTerm: string,
    myUserId: string,
    page: number
  ): Promise<Promise<PaginationReturn<ProfileCardReturn>>> {
    const myProfile = await this.profile_repo!.getByUserId(myUserId);
    if (!myProfile)
      throw new NoItemsFound('Perfil do usuário atual não encontrado');

    return this.profile_repo!.findProfile(searchTerm, myUserId, page);
  }
}
