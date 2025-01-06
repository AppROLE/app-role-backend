import { INSTITUTE_TYPE } from "src/shared/domain/enums/institute_type_enum";
import { PARTNER_TYPE } from "src/shared/domain/enums/partner_type_enum";
import { Institute } from "src/shared/domain/entities/institute";
import { LocationProps } from "src/shared/domain/entities/event";

export class InstituteViewModel {
  private institute_id?: string;
  private name: string;
  private logo_photo?: string;
  private description: string;
  private institute_type: INSTITUTE_TYPE;
  private partner_type: PARTNER_TYPE;
  private location: LocationProps;
  private price?: number;
  private photos_url?: string[];
  private events_id?: string[];

  constructor(institute: Institute) {
    this.institute_id = institute.instituteId;
    this.name = institute.instituteName;
    this.logo_photo = institute.instituteLogoPhoto;
    this.description = institute.instituteDescription;
    this.institute_type = institute.instituteInstituteType;
    this.partner_type = institute.institutePartnerType;
    this.location = institute.instituteLocation;
    this.price = institute.institutePrice;
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
      location: {
        latitude: this.location.latitude,
        longitude: this.location.longitude,
        address: this.location.address,
        number: this.location.number,
        neighborhood: this.location.neighborhood,
        city: this.location.city,
        state: this.location.state,
        cep: this.location.cep,
      },
      price: this.price,
      photosUrl: this.photos_url,
      eventsId: this.events_id,
    };
  }
}

export class GetAllInstitutesViewModel {
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
