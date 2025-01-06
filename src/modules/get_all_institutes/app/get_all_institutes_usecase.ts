import { Institute } from "src/shared/domain/entities/institute";
import { NoItemsFound } from "src/shared/helpers/errors/usecase_errors";
import { IInstituteRepository } from "src/shared/domain/repositories/institute_repository_interface";
import { Repository } from "src/shared/infra/database/repositories/repository";

export class GetAllInstitutesUseCase {
  repository: Repository;
  private readonly institute_repo: IInstituteRepository;

  constructor() {
    this.repository = new Repository({
      institute_repo: true,
    });
    this.institute_repo = this.repository.institute_repo!;
  }

  execute(): Promise<Institute[]> {
    const institutes = this.institute_repo.getAllInstitutes();
    return institutes;
  }
}
