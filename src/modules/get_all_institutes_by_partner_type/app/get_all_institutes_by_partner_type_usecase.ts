import { Institute } from 'src/shared/domain/entities/institute';
import { PARTNER_TYPE } from 'src/shared/domain/enums/partner_type_enum';
import { IInstituteRepository } from 'src/shared/domain/repositories/institute_repository_interface';
import { NoItemsFound } from 'src/shared/helpers/errors/errors';
import { PaginationReturn } from 'src/shared/helpers/types/event_pagination';
import { Repository } from 'src/shared/infra/database/repositories/repository';

export class GetAllInstitutesByPartnerTypeUseCase {
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

  async execute(
    page: number,
    partnerType: PARTNER_TYPE
  ): Promise<PaginationReturn<Institute>> {
    const filter = { partnerType, instituteType: 'ESTABELECIMENTO_FIXO' };
    return this.institute_repo!.getInstitutesByFilter(page, filter);
  }
}
