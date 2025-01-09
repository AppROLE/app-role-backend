import { Institute } from "src/shared/domain/entities/institute";
import { INSTITUTE_TYPE } from "src/shared/domain/enums/institute_type_enum";
import { PARTNER_TYPE } from "src/shared/domain/enums/partner_type_enum";
import { IInstituteRepository } from "src/shared/domain/repositories/institute_repository_interface";
import { Repository } from "src/shared/infra/database/repositories/repository";

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
        "Expected to have an instance of the institute repository"
      );
  }

  async execute(
    instituteId: string,
    description?: string,
    institute_type?: INSTITUTE_TYPE,
    partner_type?: PARTNER_TYPE,
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
    if (institute_type) {
      institute.instituteInstituteType = institute_type;
    }
    if (partner_type) {
      institute.institutePartnerType = partner_type;
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
