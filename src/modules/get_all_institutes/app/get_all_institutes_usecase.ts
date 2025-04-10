import { Institute } from 'src/shared/domain/entities/institute';
import { IInstituteRepository } from 'src/shared/domain/repositories/institute_repository_interface';
import { PaginationReturn } from 'src/shared/helpers/types/event_pagination';
import { Repository } from 'src/shared/infra/database/repositories/repository';

export class GetAllInstitutesUseCase {
  repository: Repository;
  private institute_repo?: IInstituteRepository;

  constructor() {
    this.repository = new Repository({
      institute_repo: true,
    });
  }

  async connect() {
    await this.repository.connectRepository();
    this.institute_repo = this.repository.institute_repo;

    if (!this.institute_repo)
      throw new Error(
        'Expected to have an instance of the institute repository'
      );
  }

  execute(page: number): Promise<PaginationReturn<Institute>> {
    return this.institute_repo!.getAllInstitutesPaginated(page);
  }
}
