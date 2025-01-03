import { LocationProps } from "src/shared/domain/entities/event";
import { Institute } from "src/shared/domain/entities/institute";

export class GetInstituteByIdViewModel {
  private institute_id: string;
  private name: string;
  private logo_photo: string;
  private description: string;
  private institute_type: string;
  private partner_type: string;
  private phone: string;
  private location: LocationProps;
  private price: number;
  private photos_url: string[];
  private events_id: string[];

  constructor(institute: Institute) {
    this.institute_id = institute.instituteId ?? "";
    this.name = institute.instituteName;
    this.logo_photo = institute.instituteLogoPhoto ?? "";
    this.description = institute.instituteDescription;
    this.institute_type = institute.instituteInstituteType;
    this.partner_type = institute.institutePartnerType;
    this.phone = institute.institutePhone ?? "";
    this.location = institute.instituteLocation;
    this.price = institute.institutePrice ?? 0;
    this.photos_url = institute.institutePhotosUrl ?? [];
    this.events_id = institute.instituteEventsId ?? [];
  }

  toJSON() {
    return {
      institute_id: this.institute_id,
      name: this.name,
      logo_photo: this.logo_photo,
      description: this.description,
      institute_type: this.institute_type,
      partner_type: this.partner_type,
      phone: this.phone,
      location: {
        latitude: this.location.latitude,
        longitude: this.location.longitude,
        address: this.location.address,
        neighborhood: this.location.neighborhood,
        city: this.location.city,
        state: this.location.state,
        cep: this.location.cep,
      },
      price: this.price,
      photos_url: this.photos_url,
      events_id: this.events_id,
    };
  }
}
