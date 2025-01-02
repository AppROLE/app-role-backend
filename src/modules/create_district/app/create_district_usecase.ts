import { District } from "src/shared/domain/entities/district";
import { IDistrictRepository } from "src/shared/domain/repositories/district_repository_interface";
import { Repository } from "src/shared/infra/database/repositories/repository";

export class CreateDistrictUseCase {
  repository: Repository;
  private readonly district_repo: IDistrictRepository;

  constructor() {
    this.repository = new Repository({
      district_repo: true,
    });
    this.district_repo = this.repository.district_repo!;
  }

  async execute(name: string, neighborhoods: string[]) {
    const districtEntity = new District({
      name,
      neighborhoods,
    });

    const district = await this.district_repo.createDistrict(districtEntity);

    return district;
  }
}
