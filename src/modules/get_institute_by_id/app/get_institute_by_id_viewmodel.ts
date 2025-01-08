import { LocationProps } from "src/shared/domain/entities/event";
import { Institute } from "src/shared/domain/entities/institute";

export class GetInstituteByIdViewModel {
  private instituteId: string;
  private name: string;
  private logoPhoto: string;
  private description: string;
  private institute_type: string;
  private partner_type: string;
  private phone: string;
  private location: LocationProps;
  private price: number;
  private photosUrl: string[];
  private eventsId: string[];

  constructor(institute: Institute) {
    this.instituteId = institute.instituteId ?? "";
    this.name = institute.instituteName;
    this.logoPhoto = institute.instituteLogoPhoto ?? "";
    this.description = institute.instituteDescription;
    this.institute_type = institute.instituteInstituteType;
    this.partner_type = institute.institutePartnerType;
    this.phone = institute.institutePhone ?? "";
    this.location = institute.instituteLocation;
    this.price = institute.institutePrice ?? 0;
    this.photosUrl = institute.institutePhotosUrl ?? [];
    this.eventsId = institute.instituteEventsId ?? [];
  }

  toJSON() {
    return {
      instituteId: this.instituteId,
      name: this.name,
      logoPhoto: this.logoPhoto,
      description: this.description,
      institute_type: this.institute_type,
      partner_type: this.partner_type,
      phone: this.phone,
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
