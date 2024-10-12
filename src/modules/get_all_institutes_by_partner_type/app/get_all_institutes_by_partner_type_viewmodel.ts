import { Institute } from "src/shared/domain/entities/institute";
import { INSTITUTE_TYPE } from "src/shared/domain/enums/institute_type_enum";
import { PARTNER_TYPE } from "src/shared/domain/enums/partner_type_enum";

export class InstituteViewModel {
  private institute_id?: string;
  private name: string;
  private logo_photo?: string;
  private description: string;
  private institute_type: INSTITUTE_TYPE;
  private partner_type: PARTNER_TYPE;
  private address?: string;
  private price?: number;
  private district_id?: string;
  private photos_url?: string[];
  private events_id?: string[];

  constructor(institute: Institute) {
    this.institute_id = institute.instituteId;
    this.name = institute.instituteName;
    this.logo_photo = institute.instituteLogoPhoto;
    this.description = institute.instituteDescription;
    this.institute_type = institute.instituteInstituteType;
    this.partner_type = institute.institutePartnerType;
    this.address = institute.instituteAddress;
    this.price = institute.institutePrice;
    this.district_id = institute.instituteDistrictId;
    this.photos_url = institute.institutePhotosUrl;
    this.events_id = institute.instituteEventsId;
  }

  toJSON() {
    return {
      instituteId: this.institute_id,
      name: this.name,
      logoPhoto: this.logo_photo,
      description: this.description,
      instituteType: this.institute_type,
      partnerType: this.partner_type,
      address: this.address,
      price: this.price,
      districtId: this.district_id,
      photosUrl: this.photos_url,
      eventsId: this.events_id,
    };
  }
}

export class GetAllInstitutesByPartnerTypeViewModel {
  private institutes: InstituteViewModel[];

  constructor(institutes: Institute[]) {
    if (!institutes) {
      throw new Error("Institutes array must not be undefined");
    }

    this.institutes = institutes.map(
      (institute) => new InstituteViewModel(institute)
    );
  }

  toJSON() {
    return {
      institutes: this.institutes.map((institute) => institute.toJSON()),
      message: "All institutes have been retrieved successfully",
    };
  }
}
