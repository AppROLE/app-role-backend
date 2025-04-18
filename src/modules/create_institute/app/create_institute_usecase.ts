import { Institute } from 'src/shared/domain/entities/institute';
import {
  INSTITUTE_TYPE,
  toEnum,
} from 'src/shared/domain/enums/institute_type_enum';
import {
  PARTNER_TYPE,
  toEnumPartnerType,
} from 'src/shared/domain/enums/partner_type_enum';
import { IInstituteRepository } from 'src/shared/domain/repositories/institute_repository_interface';
import { Repository } from 'src/shared/infra/database/repositories/repository';
import { IFileRepository } from 'src/shared/domain/repositories/file_repository_interface';
import { Address } from 'src/shared/domain/entities/address';
import { uuidv4 } from 'src/shared/helpers/utils/uuid_util';
import { ParsedFile } from 'src/shared/helpers/functions/export_busboy';

export interface CreateInstituteParams {
  name: string;
  logoPhoto: ParsedFile;
  description: string;
  instituteType: INSTITUTE_TYPE;
  partnerType: PARTNER_TYPE;
  phone?: string;
  address: Address;
  price?: number;
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
      throw new Error(
        'Expected to have an instance of the institute repository'
      );
    if (!this.file_repo)
      throw new Error('Expected to have an instance of the file repository');
  }

  async execute(params: CreateInstituteParams): Promise<Institute> {
    const instituteId = uuidv4();

    let logoUrl = '';

    if (params.logoPhoto) {
      logoUrl = await this.file_repo!.uploadImage(
        `institutes/${instituteId}/institute-photo.${
          params.logoPhoto.mimetype.split('/')[1]
        }`,
        params.logoPhoto.image,
        params.logoPhoto.mimetype,
        true
      );
    }

    const institute = new Institute({
      instituteId,
      address: params.address,
      description: params.description,
      logo: logoUrl,
      name: params.name,
      partnerType:
        PARTNER_TYPE[params.partnerType as keyof typeof PARTNER_TYPE],
      instituteType:
        INSTITUTE_TYPE[params.instituteType as keyof typeof INSTITUTE_TYPE],
      phone: params.phone,
      price: params.price,
      eventsId: [],
      reviewsId: [],
      createdAt: new Date().getTime(),
      updatedAt: new Date().getTime(),
    });

    return await this.institute_repo!.createInstitute(institute);
  }
}
