import { Institute } from "src/shared/domain/entities/institute";
import { NoItemsFound } from "src/shared/helpers/errors/usecase_errors";
import { IInstituteRepository } from "src/shared/domain/irepositories/institute_repository_interface";

export class GetAllInstitutesUseCase {
  constructor(private readonly repo: IInstituteRepository) {}

  execute(): Promise<Institute[]> {
    const institutes = this.repo.getAllInstitutes();
    return institutes;
  }
}
