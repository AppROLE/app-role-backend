import { Institute } from "src/shared/domain/entities/institute";
import { toEnum } from "src/shared/domain/enums/institute_type_enum";
import { toEnumPartnerType } from "src/shared/domain/enums/partner_type_enum";
import { IInstituteRepository } from "src/shared/domain/repositories/institute_repository_interface";
import { Repository } from "src/shared/infra/database/repositories/repository";

export interface CreateInstituteParams {
  name: string;
  logo_photo?: string;
  description: string;
  institute_type: string;
  partner_type: string;
  phone?: string;
  address?: string;
  price?: number;
  photos_url?: string[];
}

export class CreateInstituteUseCase {
  repository: Repository;
  private readonly institute_repo: IInstituteRepository;

  constructor() {
    this.repository = new Repository({
      institute_repo: true,
    });
    this.institute_repo = this.repository.institute_repo!;
  }

  async execute(params: CreateInstituteParams): Promise<string> {
    const institute = new Institute({
      name: params.name,
      description: params.description,
      institute_type: toEnum(params.institute_type),
      partner_type: toEnumPartnerType(params.partner_type),
      phone: params.phone || "",
      address: params.address,
      logo_photo: params.logo_photo || "",
      photos_url: params.photos_url || [],
      events_id: [],
      price: params.price || 0,
    });

    const savedInstitute = await this.institute_repo.createInstitute(institute);

    return savedInstitute;
  }
}
