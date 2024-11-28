import { IFileRepository } from "src/shared/domain/irepositories/file_repository_interface";
import { IInstituteRepository } from "src/shared/domain/irepositories/institute_repository_interface";
import { Environments } from "src/shared/environments";
import { NoItemsFound } from "src/shared/helpers/errors/usecase_errors";

export class UploadInstitutePhotoUseCase {
    constructor(
        private readonly instituteRepo: IInstituteRepository,
        private readonly fileRepo: IFileRepository
    ) {}

    async execute(
        instituteId: string,
        institutePhoto: Buffer,
        mimetype: string
      )  {
        const institute = await this.instituteRepo.getInstituteById(instituteId);

        if (!institute) {
            throw new NoItemsFound("Instituto");
        }

        const imageKey = `institutes/${instituteId}/institute-photo.${mimetype.split("/")[1]}`;

        await this.fileRepo.uploadInstitutePhoto(imageKey, institutePhoto, mimetype);

        await this.instituteRepo.updateInstitutePhoto(instituteId, `${Environments.getEnvs().cloudFrontUrl}/${imageKey}`);
    }
}