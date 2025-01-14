import { EntityError } from '../../helpers/errors/errors';
import { STATUS } from '../../domain/enums/status_enum';
import { FEATURE } from '../enums/feature_enum';
import { CATEGORY } from '../enums/category_enum';
import { PACKAGE_TYPE } from '../enums/package_type_enum';
import { AGE_ENUM } from '../enums/age_enum';
import { Address } from './address';
import { MUSIC_TYPE } from '../enums/music_type_enum';

interface EventProps {
  eventId: string;
  name: string;
  description: string;
  address: Address;
  price: number;
  ageRange: AGE_ENUM;
  eventDate: number;
  instituteId: string;
  eventStatus: STATUS;
  musicType: MUSIC_TYPE[];
  menuLink?: string;
  eventPhoto: string;
  galleryLink: string[];
  packageType: PACKAGE_TYPE[];
  category?: CATEGORY;
  ticketUrl?: string;
  features: FEATURE[];
  reviewsId: string[];
  presencesId: string[];
  createdAt: number;
  updatedAt: number;
}

export class Event {
  eventId: string;
  name: string;
  description: string;
  address: Address;
  price: number;
  ageRange: AGE_ENUM;
  eventDate: number; // timestamp
  instituteId: string;
  eventStatus: STATUS;
  musicType: MUSIC_TYPE[];
  menuLink?: string;
  eventPhoto: string;
  galleryLink: string[];
  packageType: PACKAGE_TYPE[];
  category?: CATEGORY;
  ticketUrl?: string;
  features: FEATURE[];
  reviewsId: string[];
  presencesId: string[];
  createdAt: number;
  updatedAt: number;

  constructor(props: EventProps) {
    this.eventId = props.eventId;
    this.name = props.name;
    this.description = props.description;
    this.address = props.address;

    if (!(props.price >= 1 && props.price <= 5)) {
      throw new EntityError('O preço do evento deve ser entre 1 e 5');
    }
    this.price = props.price;
    this.ageRange = props.ageRange;
    this.eventDate = props.eventDate;
    this.instituteId = props.instituteId;
    this.eventStatus = props.eventStatus;
    this.musicType = props.musicType;
    this.menuLink = props.menuLink;
    this.eventPhoto = props.eventPhoto;
    this.galleryLink = props.galleryLink;
    this.features = props.features || [];
    this.packageType = props.packageType || [];
    this.category = props.category;
    this.ticketUrl = props.ticketUrl;
    this.reviewsId = props.reviewsId || [];
    this.presencesId = props.presencesId || [];
    this.createdAt = props.createdAt;
    this.updatedAt = props.updatedAt;
  }
}
