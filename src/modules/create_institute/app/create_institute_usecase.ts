import { v4 as uuidv4 } from "uuid";
import { LocationProps } from "src/shared/domain/entities/event";
import { Institute } from "src/shared/domain/entities/institute";
import { toEnum } from "src/shared/domain/enums/institute_type_enum";
import { toEnumPartnerType } from "src/shared/domain/enums/partner_type_enum";
import { IInstituteRepository } from "src/shared/domain/repositories/institute_repository_interface";
import { Repository } from "src/shared/infra/database/repositories/repository";
import { IFileRepository } from "src/shared/domain/repositories/file_repository_interface";

export interface CreateInstituteParams {
  name: string;
  logo_photo: {
    image: Buffer;
    mimetype: string;
  };
  description: string;
  institute_type: string;
  partner_type: string;
  phone?: string;
  location: LocationProps;
  price?: number;
  photos?: {
    image: Buffer;
    mimetype: string;
  }[];
}

export class CreateInstituteUseCase {
  repository: Repository;
  private institute_repo?: IInstituteRepository;
  private file_repo?: IFileRepository;

  constructor() {
    this.repository = new Repository({
      institute_repo: true,
      file_repo: true,
    });
  }

  async connect() {
    await this.repository.connectRepository();
    this.institute_repo = this.repository.institute_repo;
    this.file_repo = this.repository.file_repo;

    if (!this.institute_repo)
      throw new Error('Expected to have an instance of the institute repository');
    if (!this.file_repo)
      throw new Error('Expected to have an instance of the file repository');
  }

  async execute(params: CreateInstituteParams): Promise<Institute> {
    const institute_id = uuidv4();

    let logoUrl = "";
    if (params.logo_photo) {
      logoUrl = await this.file_repo!.uploadImage(
        `institutes/${institute_id}/institute-photo.${
          params.logo_photo.mimetype.split("/")[1]
        }`,
        params.logo_photo.image,
        params.logo_photo.mimetype,
        true
      );
    }

    let photosUrls: string[] = [];
    if (params.photos && params.photos.length > 0) {
      for (let i = 0; i < params.photos.length; i++) {
        const photo = params.photos[i];
        const photoUrl = await this.file_repo!.uploadImage(
          `institutes/${institute_id}/photos/${i}.${
            params.logo_photo.mimetype.split("/")[1]
          }`,
          photo.image,
          photo.mimetype,
          true
        );
        photosUrls.push(photoUrl);
      }
    }

    const institute = new Institute({
      institute_id: institute_id,
      name: params.name,
      description: params.description,
      institute_type: toEnum(params.institute_type),
      partner_type: toEnumPartnerType(params.partner_type),
      phone: params.phone || "",
      location: params.location,
      logo_photo: logoUrl,
      photos_url: photosUrls,
      events_id: [],
      price: params.price || 0,
    });

    return await this.institute_repo!.createInstitute(institute);
  }
}
