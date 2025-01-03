import { Institute } from "src/shared/domain/entities/institute";
import { IInstituteRepository } from "src/shared/domain/repositories/institute_repository_interface";
import { NoItemsFound } from "src/shared/helpers/errors/usecase_errors";
import { Repository } from "src/shared/infra/database/repositories/repository";

export class GetInstituteByIdUseCase {
  repository: Repository;
  private readonly institute_repo: IInstituteRepository;

  constructor() {
    this.repository = new Repository({
      institute_repo: true,
    });
    this.institute_repo = this.repository.institute_repo!;
  }

  async execute(idInstitute: string): Promise<Institute> {
    const institute = await this.institute_repo.getInstituteById(idInstitute);
    if (!institute) {
      throw new NoItemsFound("event");
    }
    return institute;
  }
}
