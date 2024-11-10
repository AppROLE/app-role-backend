import { Institute } from "src/shared/domain/entities/institute";
import { toEnum } from "src/shared/domain/enums/institute_type_enum";
import { toEnumPartnerType } from "src/shared/domain/enums/partner_type_enum";
import { IInstituteRepository } from "src/shared/domain/irepositories/institute_repository_interface";

export interface CreateInstituteParams {
  name: string;
  logo_photo?: string;
  description: string;
  institute_type: string;
  partner_type: string;
  phone?: string;
  address?: string;
  price?: number;
  district_id?: string;
  photos_url?: string[];
}

export class CreateInstituteUseCase {
  constructor(private repo: IInstituteRepository) {}

  async execute(params: CreateInstituteParams): Promise<string> {
    const institute = new Institute({
      name: params.name,
      description: params.description,
      institute_type: toEnum(params.institute_type),
      partner_type: toEnumPartnerType(params.partner_type),
      phone: params.phone || "",
      address: params.address,
      logo_photo: params.logo_photo || "",
      district_id: params.district_id || "",
      photos_url: params.photos_url || [],
      events_id: [],
      price: params.price || 0,

    });

    const savedInstitute = await this.repo.createInstitute(institute);

    return savedInstitute;
  }
}
