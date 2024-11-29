import { IInstituteRepository } from "src/shared/domain/irepositories/institute_repository_interface";
import { IFileRepository } from "src/shared/domain/irepositories/file_repository_interface";
import { NoItemsFound } from "src/shared/helpers/errors/usecase_errors";

export class DeleteInstitutePhotoUseCase {
  constructor(
    private readonly fileRepository: IFileRepository,
    private readonly instituteRepository: IInstituteRepository
  ) {}

  async execute(instituteId: string): Promise<void> {
    const institute = await this.instituteRepository.getInstituteById(instituteId);
    if (!institute) {
      throw new NoItemsFound("Institute");
    }
    await this.fileRepository.deleteInstitutePhoto(instituteId);

    await this.instituteRepository.updateInstitute(instituteId, JSON.stringify({
        logo_photo: "",
    }));
  }
}
