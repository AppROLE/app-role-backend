import { Institute } from "src/shared/domain/entities/institute";
import { INSTITUTE_TYPE } from "src/shared/domain/enums/institute_type_enum";
import { PARTNER_TYPE } from "src/shared/domain/enums/partner_type_enum";
import { IInstituteRepository } from "src/shared/domain/repositories/institute_repository_interface";
import { Repository } from "src/shared/infra/database/repositories/repository";

export class UpdateInstituteUseCase {
  repository: Repository;
  private readonly institute_repo: IInstituteRepository;

  constructor() {
    this.repository = new Repository({
      institute_repo: true,
    });
    this.institute_repo = this.repository.institute_repo!;
  }

  async execute(
    institute_id: string,
    description?: string,
    institute_type?: INSTITUTE_TYPE,
    partner_type?: PARTNER_TYPE,
    name?: string,
    address?: string,
    district_id?: string,
    phone?: string
  ) {
    const institute: {
      instituteId: string;
      instituteDescription?: string;
      instituteInstituteType?: INSTITUTE_TYPE;
      institutePartnerType?: PARTNER_TYPE;
      instituteName?: string;
      instituteAddress?: string;
      instituteDistrictId?: string;
      institutePrice?: number;
      institutePhone?: string;
    } = {
      instituteId: institute_id,
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
    if (address) {
      institute.instituteAddress = address;
    }
    if (district_id) {
      institute.instituteDistrictId = district_id;
    }
    if (phone) {
      institute.institutePhone = phone;
    }

    await this.institute_repo.updateInstitute(
      institute.instituteId,
      institute.instituteDescription,
      institute.instituteInstituteType,
      institute.institutePartnerType,
      institute.instituteName,
      institute.instituteAddress,
      institute.instituteDistrictId,
      institute.institutePhone
    );
  }
}
