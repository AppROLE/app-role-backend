import { INSTITUTE_TYPE, toEnum } from "../enums/institute_type_enum";
import { EntityError } from "../../helpers/errors/domain_errors";
import { PARTNER_TYPE, toEnumPartnerType } from "../enums/partner_type_enum";
import { LocationProps } from "./event";

interface InstituteProps {
  institute_id?: string | undefined;
  name: string;
  description: string;
  institute_type: INSTITUTE_TYPE;
  partner_type: PARTNER_TYPE;
  phone?: string | undefined;
  logo_photo?: string;
  location: LocationProps;
  price?: number | undefined;
  photos_url?: string[] | undefined;
  events_id?: string[] | undefined;
}

export class Institute {
  private institute_id?: string;
  private name: string;
  private logo_photo?: string;
  private description: string;
  private institute_type: INSTITUTE_TYPE;
  private partner_type: PARTNER_TYPE;
  private phone?: string;
  private location: LocationProps;
  private price?: number;
  private photos_url?: string[];
  private events_id?: string[];

  constructor(props: InstituteProps) {
    this.validate(props);
    this.institute_id = props.institute_id || undefined;
    this.name = props.name;
    this.logo_photo = props.logo_photo || undefined;
    this.description = props.description;
    this.institute_type = toEnum(props.institute_type);
    this.partner_type = toEnumPartnerType(props.partner_type);
    this.phone = props.phone || undefined;
    this.location = props.location;
    this.price = props.price || 0;
    this.photos_url = props.photos_url || undefined;
    this.events_id = props.events_id || undefined;
  }

  // getters
  get instituteId(): string | undefined {
    return this.institute_id;
  }
  get instituteName(): string {
    return this.name;
  }
  get instituteLogoPhoto(): string | undefined {
    return this.logo_photo;
  }
  get instituteDescription(): string {
    return this.description;
  }
  get instituteInstituteType(): INSTITUTE_TYPE {
    return this.institute_type;
  }
  get instituteLocation(): LocationProps {
    return this.location;
  }
  get institutePrice(): number | undefined {
    return this.price;
  }
  get institutePhotosUrl(): string[] | undefined {
    return this.photos_url;
  }
  get instituteEventsId(): string[] | undefined {
    return this.events_id;
  }
  get institutePartnerType(): PARTNER_TYPE {
    return this.partner_type;
  }
  get institutePhone(): string | undefined {
    return this.phone;
  }
  // setters
  set instituteId(id: string) {
    this.institute_id = id;
  }
  set instituteName(name: string) {
    this.validateName(name);
    this.name = name;
  }
  set instituteLogoPhoto(logo_photo: string) {
    this.logo_photo = logo_photo;
  }
  set instituteDescription(description: string) {
    this.description = description;
  }
  set instituteInstituteType(institute_type: string) {
    this.institute_type = toEnum(institute_type);
  }
  set instituteLocation(location: LocationProps) {
    this.location = location;
  }
  set institutePrice(price: number) {
    this.price = price;
  }
  set institutePhotosUrl(photos_url: string[]) {
    this.photos_url = photos_url;
  }
  set instituteEventsId(events_id: string[]) {
    this.events_id = events_id;
  }
  set institutePartnerType(partner_type: string) {
    this.partner_type = toEnumPartnerType(partner_type);
  }
  set institutePhone(phone: string) {
    this.phone = phone;
  }
  // methods
  private validate(props: InstituteProps): void {
    this.validateName(props.name);
    this.validateInstituteType(props.institute_type);
    this.validatePartnerType(props.partner_type);
    if (props.phone) {
      this.validatePhone(props.phone);
    }
  }

  private validateName(name: string): void {
    if (!name || name.trim().length < 3) {
      throw new EntityError("Nome deve conter pelo menos 3 caracteres");
    }
  }

  private validateInstituteType(institute_type: string): void {
    try {
      toEnum(institute_type);
    } catch (error) {
      throw new EntityError("Tipo de instituto");
    }
  }

  private validatePartnerType(partner_type: string): void {
    try {
      toEnumPartnerType(partner_type);
    } catch (error) {
      throw new EntityError("partner type");
    }
  }

  private validatePhone(phone: string): void {
    if (!phone || phone.trim().length < 8) {
      throw new EntityError("Telefone");
    }
  }
}
