import {
  PARTNER_TYPE,
  toEnumPartnerType,
} from 'src/shared/domain/enums/partner_type_enum';
import { Institute } from '../../../domain/entities/institute';
import { INSTITUTE_TYPE } from '../../../domain/enums/institute_type_enum';
import { IInstitute, InstituteModel } from '../models/institute.model';
import { Address } from 'src/shared/domain/entities/address';

export interface InstituteMongoDTOProps {
  instituteId: string;
  name: string;
  logo: string;
  description: string;
  instituteType: INSTITUTE_TYPE;
  partnerType: PARTNER_TYPE;
  phone?: string;
  address: Address;
  price?: number;
  rating?: number;
  eventsId: string[];
  reviewsId: string[];
  createdAt: number;
  updatedAt: number;
}

export class InstituteMongoDTO {
  instituteId: string;
  name: string;
  logo: string;
  description: string;
  instituteType: INSTITUTE_TYPE;
  partnerType: PARTNER_TYPE;
  phone?: string;
  address: Address;
  price?: number;
  rating?: number;
  eventsId: string[];
  reviewsId: string[];
  createdAt: number;
  updatedAt: number;

  constructor(props: InstituteMongoDTOProps) {
    this.instituteId = props.instituteId;
    this.name = props.name;
    this.logo = props.logo;
    this.description = props.description;
    this.instituteType = props.instituteType;
    this.partnerType = props.partnerType;
    this.phone = props.phone;
    this.address = props.address;
    this.price = props.price;
    this.rating = props.rating;
    this.eventsId = props.eventsId;
    this.reviewsId = props.reviewsId || [];
    this.createdAt = props.createdAt;
    this.updatedAt = props.updatedAt;
  }

  toEntity(): Institute {
    return new Institute({
      instituteId: this.instituteId,
      partnerType: this.partnerType,
      name: this.name,
      logo: this.logo,
      description: this.description,
      instituteType: this.instituteType,
      phone: this.phone,
      address: this.address,
      price: this.price,
      rating: this.rating,
      eventsId: this.eventsId,
      reviewsId: this.reviewsId,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    });
  }

  static fromEntity(institute: Institute): InstituteMongoDTO {
    return new InstituteMongoDTO({
      instituteId: institute.instituteId,
      name: institute.name,
      logo: institute.logo,
      description: institute.description,
      instituteType: institute.instituteType,
      partnerType: institute.partnerType,
      phone: institute.phone,
      address: institute.address,
      price: institute.price,
      rating: institute.rating,
      eventsId: institute.eventsId,
      reviewsId: institute.reviewsId,
      createdAt: institute.createdAt,
      updatedAt: institute.updatedAt,
    });
  }

  toMongo(): IInstitute {
    return new InstituteModel({
      _id: this.instituteId,
      name: this.name,
      logo: this.logo,
      description: this.description,
      instituteType: this.instituteType,
      partnerType: this.partnerType,
      phone: this.phone,
      address: this.address,
      price: this.price,
      rating: this.rating,
      eventsId: this.eventsId,
      reviewsId: this.reviewsId,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    });
  }

  static fromMongo(institute: IInstitute): InstituteMongoDTO {
    return new InstituteMongoDTO({
      instituteId: institute._id,
      name: institute.name,
      logo: institute.logo,
      description: institute.description,
      instituteType: institute.instituteType,
      partnerType: institute.partnerType,
      phone: institute.phone,
      address: institute.address,
      price: institute.price,
      rating: institute.rating,
      eventsId: institute.eventsId,
      reviewsId: institute.reviewsId,
      createdAt: institute.createdAt.getTime(),
      updatedAt: institute.updatedAt.getTime(),
    });
  }
}
