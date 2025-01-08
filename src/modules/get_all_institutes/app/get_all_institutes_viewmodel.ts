import { INSTITUTE_TYPE } from "src/shared/domain/enums/institute_type_enum";
import { PARTNER_TYPE } from "src/shared/domain/enums/partner_type_enum";
import { Institute } from "src/shared/domain/entities/institute";
import { LocationProps } from "src/shared/domain/entities/event";

export class InstituteViewModel {
  private instituteId?: string;
  private name: string;
  private logoPhoto?: string;
  private description: string;
  private institute_type: INSTITUTE_TYPE;
  private partner_type: PARTNER_TYPE;
  private location: LocationProps;
  private price?: number;
  private photosUrl?: string[];
  private eventsId?: string[];

  constructor(institute: Institute) {
    this.instituteId = institute.instituteId;
    this.name = institute.instituteName;
    this.logoPhoto = institute.instituteLogoPhoto;
    this.description = institute.instituteDescription;
    this.institute_type = institute.instituteInstituteType;
    this.partner_type = institute.institutePartnerType;
    this.location = institute.instituteLocation;
    this.price = institute.institutePrice;
    this.photosUrl = institute.institutePhotosUrl;
    this.eventsId = institute.instituteEventsId;
  }

  toJSON() {
    return {
      instituteId: this.instituteId,
      name: this.name,
      logoPhoto: this.logoPhoto,
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
      photosUrl: this.photosUrl,
      eventsId: this.eventsId,
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
