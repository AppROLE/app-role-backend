import { IEvent, EventModel } from '../models/event.model';
import { Event } from '../../../domain/entities/event';
import { STATUS } from '../../../domain/enums/status_enum';
import { CATEGORY } from 'src/shared/domain/enums/category_enum';
import { PACKAGE_TYPE } from 'src/shared/domain/enums/package_type_enum';
import { FEATURE } from 'src/shared/domain/enums/feature_enum';
import { AGE_ENUM } from 'src/shared/domain/enums/age_enum';
import { Address } from 'src/shared/domain/entities/address';
import { MUSIC_TYPE } from 'src/shared/domain/enums/music_type_enum';

export interface EventMongoDTOProps {
  _id: string;
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

export class EventMongoDTO {
  _id: string;
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

  constructor(props: EventMongoDTOProps) {
    this._id = props._id;
    this.instituteId = props.instituteId;
    this.name = props.name;
    this.address = props.address;
    this.price = props.price;
    this.description = props.description;
    this.ageRange = props.ageRange;
    this.eventDate = props.eventDate;
    this.eventStatus = props.eventStatus;
    this.musicType = props.musicType || [];
    this.menuLink = props.menuLink;
    this.eventPhoto = props.eventPhoto;
    this.galleryLink = props.galleryLink || [];
    this.packageType = props.packageType || [];
    this.category = props.category;
    this.ticketUrl = props.ticketUrl;
    this.features = props.features || [];
    this.reviewsId = props.reviewsId || [];
    this.presencesId = props.presencesId || [];
    this.createdAt = props.createdAt;
    this.updatedAt = props.updatedAt;
  }

  static fromMongo(eventDoc: IEvent): EventMongoDTO {
    return new EventMongoDTO({
      _id: eventDoc._id,
      instituteId: eventDoc.instituteId,
      name: eventDoc.name,
      address: eventDoc.address,
      price: eventDoc.price,
      description: eventDoc.description,
      ageRange: eventDoc.ageRange,
      eventDate: eventDoc.eventDate.getTime(),
      features: eventDoc.features,
      eventStatus: eventDoc.eventStatus,
      musicType: eventDoc.musicType,
      menuLink: eventDoc.menuLink,
      eventPhoto: eventDoc.eventPhoto,
      galleryLink: eventDoc.galleryLink,
      packageType: eventDoc.packageType,
      category: eventDoc.category,
      ticketUrl: eventDoc.ticketUrl,
      reviewsId: eventDoc.reviewsId,
      presencesId: eventDoc.presencesId,
      createdAt: eventDoc.createdAt.getTime(),
      updatedAt: eventDoc.updatedAt.getTime(),
    });
  }

  toEntity(): Event {
    return new Event({
      eventId: this._id,
      name: this.name,
      description: this.description,
      address: this.address,
      price: this.price,
      ageRange: this.ageRange,
      eventDate: this.eventDate,
      features: (this.features || [])
        .filter((feature) => feature !== null)
        .map((feature) => feature as FEATURE),
      eventStatus: this.eventStatus as STATUS,
      musicType: (this.musicType || []).map((type) => type as MUSIC_TYPE),
      menuLink: this.menuLink,
      eventPhoto: this.eventPhoto,
      galleryLink: this.galleryLink || [],
      instituteId: this.instituteId,
      packageType: (this.packageType || []).map(
        (type) => type as PACKAGE_TYPE
      ),
      category: this.category as CATEGORY,
      ticketUrl: this.ticketUrl,
      reviewsId: this.reviewsId,
      presencesId: this.presencesId,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    });
  }

  static fromEntity(event: Event): EventMongoDTO {
    return new EventMongoDTO({
      _id: event.eventId,
      instituteId: event.instituteId,
      name: event.name,
      address: event.address,
      price: event.price,
      description: event.description,
      ageRange: event.ageRange,
      eventDate: event.eventDate,
      features: event.features,
      eventStatus: event.eventStatus,
      musicType: event.musicType,
      menuLink: event.menuLink || '',
      eventPhoto: event.eventPhoto || '',
      galleryLink: event.galleryLink || [],
      packageType: event.packageType || [],
      category: event.category,
      ticketUrl: event.ticketUrl || '',
      reviewsId: event.reviewsId,
      presencesId: event.presencesId,
      createdAt: event.createdAt,
      updatedAt: event.updatedAt,
    });
  }

  toMongo(): IEvent {
    return new EventModel({
      _id: this._id,
      instituteId: this.instituteId,
      name: this.name,
      address: this.address,
      price: this.price,
      description: this.description,
      ageRange: this.ageRange,
      eventDate: this.eventDate,
      features: this.features,
      eventStatus: this.eventStatus,
      musicType: this.musicType,
      menuLink: this.menuLink,
      eventPhoto: this.eventPhoto,
      galleryLink: this.galleryLink,
      packageType: this.packageType,
      category: this.category,
      ticketUrl: this.ticketUrl,
      reviewsId: this.reviewsId,
      presencesId: this.presencesId,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    });
  }
}
