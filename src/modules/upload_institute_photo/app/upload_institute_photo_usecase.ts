import { IFileRepository } from "src/shared/domain/repositories/file_repository_interface";
import { IInstituteRepository } from "src/shared/domain/repositories/institute_repository_interface";
import { Environments } from "src/shared/environments";
import { NoItemsFound } from "src/shared/helpers/errors/usecase_errors";
import { Repository } from "src/shared/infra/database/repositories/repository";

export class UploadInstitutePhotoUseCase {
  repository: Repository;
  private readonly institute_repo: IInstituteRepository;
  private readonly file_repo: IFileRepository;

  constructor() {
    this.repository = new Repository({
      institute_repo: true,
      file_repo: true,
    });
    this.institute_repo = this.repository.institute_repo!;
    this.file_repo = this.repository.file_repo!;
  }

  async execute(instituteId: string, institutePhoto: Buffer, mimetype: string) {
    const institute = await this.institute_repo.getInstituteById(instituteId);

    if (!institute) {
      throw new NoItemsFound("Instituto");
    }

    const imageKey = `institutes/${instituteId}/institute-photo.${
      mimetype.split("/")[1]
    }`;

    await this.file_repo.uploadInstitutePhoto(
      imageKey,
      institutePhoto,
      mimetype
    );

    await this.institute_repo.updateInstitutePhoto(
      instituteId,
      `${Environments.cloudFrontUrl}/${imageKey}`
    );
  }
}
