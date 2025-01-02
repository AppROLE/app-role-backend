import { IDistrictRepository } from "src/shared/domain/repositories/district_repository_interface";
import { NoItemsFound } from "src/shared/helpers/errors/usecase_errors";
import { Repository } from "src/shared/infra/database/repositories/repository";

export class GetDistrictByIdUseCase {
  repository: Repository;
  private readonly district_repo: IDistrictRepository;

  constructor() {
    this.repository = new Repository({
      district_repo: true,
    });
    this.district_repo = this.repository.district_repo!;
  }

  async execute(districtId: string) {
    const district = await this.district_repo.getDistrictById(districtId);

    if (!district) throw new NoItemsFound("zona");

    return district;
  }
}
