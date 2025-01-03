import { PARTNER_TYPE } from "src/shared/domain/enums/partner_type_enum";
import { IInstituteRepository } from "src/shared/domain/repositories/institute_repository_interface";
import { NoItemsFound } from "src/shared/helpers/errors/usecase_errors";
import { Repository } from "src/shared/infra/database/repositories/repository";

export class GetAllInstitutesByPartnerTypeUseCase {
  repository: Repository;
  private readonly institute_repo: IInstituteRepository;

  constructor() {
    this.repository = new Repository({
      institute_repo: true,
    });
    this.institute_repo = this.repository.institute_repo!;
  }

  async execute(partner_type: PARTNER_TYPE) {
    const institutes =
      this.institute_repo.getAllInstitutesByPartnerType(partner_type);
    return institutes;
  }
}
