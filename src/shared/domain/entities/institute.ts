import { INSTITUTE_TYPE, toEnum } from "../enums/institute_type_enum";
import { EntityError } from "../../helpers/errors/errors";
import { PARTNER_TYPE, toEnumPartnerType } from "../enums/partner_type_enum";
import { Address } from "./address";

interface InstituteProps {
  instituteId: string;
  name: string;
  description: string;
  instituteType: INSTITUTE_TYPE;
  partnerType: PARTNER_TYPE;
  phone?: string;
  logoPhoto: string;
  address: Address;
  price?: number;
  photosUrl: string[];
  eventsId: string[];
  createdAt: number;
  updatedAt: number;
}

export class Institute {
  instituteId: string;
  name: string;
  logoPhoto: string;
  description: string;
  instituteType: INSTITUTE_TYPE;
  partnerType: PARTNER_TYPE;
  phone?: string;
  address: Address;
  price?: number;
  photosUrl: string[];
  eventsId: string[];
  createdAt: number;
  updatedAt: number;

  constructor(props: InstituteProps) {
    this.validate(props);
    this.instituteId = props.instituteId;
    this.name = props.name;
    this.logoPhoto = props.logoPhoto;
    this.description = props.description;
    this.instituteType = toEnum(props.instituteType);
    this.partnerType = toEnumPartnerType(props.partnerType);
    this.phone = props.phone;
    this.address = props.address;
    this.price = props.price || 0;
    this.photosUrl = props.photosUrl;
    this.eventsId = props.eventsId;
    this.createdAt = props.createdAt;
    this.updatedAt = props.updatedAt;
  }

  private validate(props: InstituteProps): void {
    this.validateName(props.name);
    this.validateInstituteType(props.instituteType);
    this.validatePartnerType(props.partnerType);
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
