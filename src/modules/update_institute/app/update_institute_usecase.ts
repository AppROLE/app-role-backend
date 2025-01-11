import { Institute } from 'src/shared/domain/entities/institute';
import { INSTITUTE_TYPE } from 'src/shared/domain/enums/institute_type_enum';
import { PARTNER_TYPE } from 'src/shared/domain/enums/partner_type_enum';
import { IInstituteRepository } from 'src/shared/domain/repositories/institute_repository_interface';
import { NoItemsFound } from 'src/shared/helpers/errors/errors';
import { Repository } from 'src/shared/infra/database/repositories/repository';

interface UpdateInstituteParams {
  instituteId: string;
    description?: string;
    instituteType?: INSTITUTE_TYPE;
    partnerType?: PARTNER_TYPE;
    name?: string;
    phone?: string
}

export class UpdateInstituteUseCase {
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

  async execute(params: UpdateInstituteParams): Promise<Institute> {

    const institute = await this.institute_repo!.getInstituteById(
      params.instituteId
    );
    if (!institute) {
      throw new NoItemsFound('Instituto não encontrado');
    }

    return await this.institute_repo!.updateInstitute(
      params.instituteId,
      params
    );
  }
}
