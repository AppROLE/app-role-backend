import { Institute } from 'src/shared/domain/entities/institute';
import { IInstituteRepository } from 'src/shared/domain/repositories/institute_repository_interface';
import { NoItemsFound } from 'src/shared/helpers/errors/errors';
import { Repository } from 'src/shared/infra/database/repositories/repository';

export class GetInstituteUsecase {
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

  async execute(idInstitute: string): Promise<Institute> {
    const institute = await this.institute_repo!.getInstituteById(idInstitute);
    if (!institute) {
      throw new NoItemsFound('event');
    }
    return institute;
  }
}
