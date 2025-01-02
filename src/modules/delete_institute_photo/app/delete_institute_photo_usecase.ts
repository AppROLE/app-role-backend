import { IInstituteRepository } from "src/shared/domain/repositories/institute_repository_interface";
import { IFileRepository } from "src/shared/domain/repositories/file_repository_interface";
import { NoItemsFound } from "src/shared/helpers/errors/usecase_errors";
import { Repository } from "src/shared/infra/database/repositories/repository";

export class DeleteInstitutePhotoUseCase {
  repository: Repository;
  private readonly file_repo: IFileRepository;
  private readonly institute_repo: IInstituteRepository;

  constructor() {
    this.repository = new Repository({
      event_repo: true,
      file_repo: true,
    });
    this.file_repo = this.repository.file_repo!;
    this.institute_repo = this.repository.institute_repo!;
  }

  async execute(instituteId: string): Promise<void> {
    const institute = await this.institute_repo.getInstituteById(instituteId);
    if (!institute) {
      throw new NoItemsFound("Institute");
    }
    await this.file_repo.deleteInstitutePhoto(instituteId);

    await this.institute_repo.updateInstitute(
      instituteId,
      JSON.stringify({
        logo_photo: "",
      })
    );
  }
}
