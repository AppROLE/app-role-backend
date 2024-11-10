import { MissingParameters } from "src/shared/helpers/errors/controller_errors";
import { UploadInstitutePhotoUseCase } from "./upload_institute_photo_usecase";
import { UploadInstitutePhotoViewmodel } from "./upload_institute_photo_viewmodel";
import { BadRequest, InternalServerError, NotFound, OK } from "src/shared/helpers/external_interfaces/http_codes";
import { EntityError } from "src/shared/helpers/errors/domain_errors";
import { NoItemsFound } from "src/shared/helpers/errors/usecase_errors";
import { IRequest } from "src/shared/helpers/external_interfaces/external_interface";

export class UploadInstitutePhotoController {
    constructor(private readonly usecase: UploadInstitutePhotoUseCase) {}

    async handle(request: IRequest, formData: any) {
        try {
            const instituteId = formData.fields.instituteId
            const typePhoto = formData.fields.typePhoto;

            if (!instituteId) {
                throw new MissingParameters("instituteId")
            }
            if (!typePhoto) {
                throw new MissingParameters("typePhoto");
            }

            const imagesBuffers = formData.files.map((file: any) => {
                return file.data
            }) as Buffer[]

            const fieldNames = formData.files.map((file: any) => {
                return file.fieldname
            }) as string[]
        
            const mimetypes = formData.files.map((file: any) => {
                return file.mimeType
            }) as string[]

            console.log("imagesBuffers: ", imagesBuffers)
            console.log("fieldNames: ", fieldNames)
            console.log("mimetypes: ", mimetypes)

            await this.usecase.execute(instituteId, imagesBuffers[0], typePhoto, mimetypes[0])

            const viewmodel = new UploadInstitutePhotoViewmodel("A foto do instituto foi adicionada com sucesso!")

            return new OK(viewmodel.toJSON())
        } catch (error: any) {
            if (error instanceof EntityError) {
                return new BadRequest(error.message)
            }
            if (error instanceof NoItemsFound) {
                return new NotFound(error.message)
            }
            if (error instanceof MissingParameters) {
                return new BadRequest(error.message)
            }
            if (error instanceof Error) {
                return new InternalServerError("Internal Server Error, error: " + error.message)
            }
        }
    }
}