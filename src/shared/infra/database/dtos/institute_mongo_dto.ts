import {
  PARTNER_TYPE,
  toEnumPartnerType,
} from "src/shared/domain/enums/partner_type_enum";
import { Institute } from "../../../domain/entities/institute";
import { INSTITUTE_TYPE } from "../../../domain/enums/institute_type_enum";
import { IInstitute, InstituteModel } from "../models/institute.model";
import { Address } from "src/shared/domain/entities/address";

export interface InstituteMongoDTOProps {
  _id: string;
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
}

export class InstituteMongoDTO {
  private _id: string;
  private name: string;
  private logoPhoto: string;
  private description: string;
  private instituteType: INSTITUTE_TYPE;
  private partnerType: PARTNER_TYPE;
  private phone?: string;
  private address: Address;
  private price?: number;
  private photosUrl: string[];
  private eventsId: string[];

  constructor(props: InstituteMongoDTOProps) {
    this._id = props._id;
    this.name = props.name;
    this.logoPhoto = props.logoPhoto;
    this.description = props.description;
    this.instituteType = props.instituteType;
    this.partnerType = props.partnerType;
    this.phone = props.phone;
    this.address = props.address;
    this.price = props.price;
    this.photosUrl = props.photosUrl;
    this.eventsId = props.eventsId;
  }

  toEntity(): Institute {
    return new Institute({
      instituteId: this._id,
      partnerType: this.partnerType,
      name: this.name,
      logoPhoto: this.logoPhoto,
      description: this.description,
      instituteType: this.instituteType,
      phone: this.phone,
      address: this.address,
      price: this.price,
      photosUrl: this.photosUrl,
      eventsId: this.eventsId,
    });
  }

  static fromEntity(institute: Institute): InstituteMongoDTO {
    return new InstituteMongoDTO({
      _id: institute.instituteId,
      name: institute.name,
      logoPhoto: institute.logoPhoto,
      description: institute.description,
      instituteType: institute.instituteType,
      partnerType: institute.partnerType,
      phone: institute.phone,
      address: institute.address,
      price: institute.price,
      photosUrl: institute.photosUrl,
      eventsId: institute.eventsId,
    });
  }

  toMongo(): IInstitute {
    return new InstituteModel({
      _id: this._id,
      name: this.name,
      logoPhoto: this.logoPhoto,
      description: this.description,
      institute_type: this.instituteType,
      partner_type: this.partnerType,
      phone: this.phone,
      location: this.address,
      price: this.price,
      photosUrl: this.photosUrl,
      eventsId: this.eventsId,
    });
  }

  static fromMongo(institute: any): InstituteMongoDTO {
    return new InstituteMongoDTO({
      _id: institute._id,
      name: institute.name,
      logoPhoto: institute.logoPhoto,
      description: institute.description,
      instituteType: institute.institute_type,
      partnerType: institute.partner_type,
      phone: institute.phone,
      address: institute.location,
      price: institute.price,
      photosUrl: institute.photosUrl,
      eventsId: institute.eventsId,
    });
  }
}
