import { PARTNER_TYPE } from "src/shared/domain/enums/partner_type_enum";
import { IInstituteRepository } from "src/shared/domain/irepositories/institute_repository_interface";
import { NoItemsFound } from "src/shared/helpers/errors/usecase_errors";

export class GetAllInstitutesByPartnerTypeUseCase {
  constructor(private readonly repo: IInstituteRepository) {}

  async execute(partner_type: PARTNER_TYPE) {
    const institutes = this.repo.getAllInstitutesByPartnerType(partner_type);
    return institutes;
  }
}
