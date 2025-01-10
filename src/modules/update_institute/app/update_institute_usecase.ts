import { INSTITUTE_TYPE } from 'src/shared/domain/enums/institute_type_enum';
import { PARTNER_TYPE } from 'src/shared/domain/enums/partner_type_enum';
import { IInstituteRepository } from 'src/shared/domain/repositories/institute_repository_interface';
import { Repository } from 'src/shared/infra/database/repositories/repository';

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

  async execute(
    instituteId: string,
    description?: string,
    instituteType?: INSTITUTE_TYPE,
    partnerType?: PARTNER_TYPE,
    name?: string,
    phone?: string
  ) {
    const institute: {
      instituteId: string;
      instituteDescription?: string;
      instituteInstituteType?: INSTITUTE_TYPE;
      institutePartnerType?: PARTNER_TYPE;
      instituteName?: string;
      institutePrice?: number;
      institutePhone?: string;
    } = {
      instituteId: instituteId,
    };
    if (description) {
      institute.instituteDescription = description;
    }
    if (instituteType) {
      institute.instituteInstituteType = instituteType;
    }
    if (partnerType) {
      institute.institutePartnerType = partnerType;
    }
    if (name) {
      institute.instituteName = name;
    }
    if (phone) {
      institute.institutePhone = phone;
    }

    await this.institute_repo!.updateInstitute(
      institute.instituteId,
      institute.instituteDescription,
      institute.instituteInstituteType,
      institute.institutePartnerType,
      institute.instituteName,
      undefined,
      institute.institutePhone
    );
  }
}
