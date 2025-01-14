import { IProfileRepository } from 'src/shared/domain/repositories/profile_repository_interface';
import { NoItemsFound } from 'src/shared/helpers/errors/errors';
import { EventCardReturn } from 'src/shared/helpers/types/event_card_return';
import { PaginationReturn } from 'src/shared/helpers/types/event_pagination';
import { Repository } from 'src/shared/infra/database/repositories/repository';

export class GetMyHistoricEventsUsecase {
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
    page: number,
    userId: string
  ): Promise<PaginationReturn<EventCardReturn>> {
    const myProfile = await this.profile_repo!.getByUserId(userId);
    if (!myProfile) throw new NoItemsFound('Perfil do usuário não encontrado');

    return await this.profile_repo!.getHistoricPresencesEventCardsForProfile(
      userId,
      page
    );
  }
}
