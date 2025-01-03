import { toEnumPartnerType } from "src/shared/domain/enums/partner_type_enum";
import { Institute } from "../../../domain/entities/institute";
import { INSTITUTE_TYPE } from "../../../domain/enums/institute_type_enum";
import instituteModel, {
  IInstitute as InstituteDocument,
} from "../models/institute.model";
import { LocationProps } from "src/shared/domain/entities/event";

export interface InstituteMongoDTOProps {
  _id: string;
  name: string;
  logo_photo: string;
  description: string;
  institute_type: string;
  partner_type: string;
  phone: string;
  location: LocationProps;
  price: number;
  photos: string[];
  events: string[];
}

export class InstituteMongoDTO {
  private _id: string;
  private name: string;
  private logo_photo: string;
  private description: string;
  private institute_type: INSTITUTE_TYPE;
  private partner_type: string;
  private phone: string;
  private location: LocationProps;
  private price: number;
  private photos: string[];
  private events: string[];

  constructor(props: InstituteMongoDTOProps) {
    this._id = props._id;
    this.name = props.name;
    this.logo_photo = props.logo_photo;
    this.description = props.description;
    this.institute_type = props.institute_type as INSTITUTE_TYPE;
    this.partner_type = props.partner_type;
    this.phone = props.phone;
    this.location = props.location;
    this.price = props.price;
    this.photos = props.photos;
    this.events = props.events;
  }

  static toEntity(instituteMongoDTO: InstituteMongoDTO): Institute {
    return new Institute({
      institute_id: instituteMongoDTO._id,
      partner_type: toEnumPartnerType(instituteMongoDTO.partner_type),
      name: instituteMongoDTO.name,
      logo_photo: instituteMongoDTO.logo_photo,
      description: instituteMongoDTO.description,
      institute_type: instituteMongoDTO.institute_type,
      phone: instituteMongoDTO.phone,
      location: instituteMongoDTO.location,
      price: instituteMongoDTO.price,
      photos_url: instituteMongoDTO.photos,
      events_id: instituteMongoDTO.events,
    });
  }

  static fromEntity(institute: Institute): InstituteMongoDTO {
    return new InstituteMongoDTO({
      _id: institute.instituteId || "",
      name: institute.instituteName,
      logo_photo: institute.instituteLogoPhoto || "",
      description: institute.instituteDescription,
      institute_type: institute.instituteInstituteType,
      partner_type: institute.institutePartnerType,
      phone: institute.institutePhone || "",
      location: institute.instituteLocation,
      price: institute.institutePrice || 0,
      photos: institute.institutePhotosUrl || [],
      events: institute.instituteEventsId || [],
    });
  }

  static toMongo(instituteMongoDTO: InstituteMongoDTO): InstituteDocument {
    const instituteDocument = new instituteModel({
      _id: instituteMongoDTO._id,
      name: instituteMongoDTO.name,
      logo_photo: instituteMongoDTO.logo_photo,
      description: instituteMongoDTO.description,
      institute_type: instituteMongoDTO.institute_type,
      partner_type: instituteMongoDTO.partner_type,
      phone: instituteMongoDTO.phone,
      location: instituteMongoDTO.location,
      price: instituteMongoDTO.price,
      photos: instituteMongoDTO.photos,
      events: instituteMongoDTO.events,
    });

    return instituteDocument as InstituteDocument;
  }

  static fromMongo(institute: any): InstituteMongoDTO {
    return new InstituteMongoDTO({
      _id: institute._id,
      name: institute.name,
      logo_photo: institute.logo_photo,
      description: institute.description,
      institute_type: institute.institute_type,
      partner_type: institute.partner_type,
      phone: institute.phone,
      location: institute.location,
      price: institute.price,
      photos: institute.photos,
      events: institute.events,
    });
  }
}
