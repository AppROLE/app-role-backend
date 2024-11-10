import { IFileRepository } from "src/shared/domain/irepositories/file_repository_interface";
import { IInstituteRepository } from "src/shared/domain/irepositories/institute_repository_interface";
import { Environments } from "src/shared/environments";

export class UploadInstitutePhotoUseCase {
    constructor(
        private readonly instituteRepo: IInstituteRepository,
        private readonly fileRepo: IFileRepository
    ) {}

    async execute(instituteId: string, institutePhoto: Buffer, typePhoto: string, mimetype: string) {
        const institute = await this.instituteRepo.getInstituteById(instituteId);
        const instituteName = institute.instituteName;
        const nameFormat = instituteName.trim().replace(/\s+/g, "+").replace(/[^a-zA-Z0-9+]/g, "");
        const imageKey = `${nameFormat}-logo${typePhoto}`;

        await this.fileRepo.uploadInstitutePhoto(instituteId, instituteName, imageKey, institutePhoto, mimetype);

        await this.instituteRepo.updateInstitutePhoto(instituteId, `${Environments.getEnvs().cloudFrontUrl}/${imageKey}`);
    }
}