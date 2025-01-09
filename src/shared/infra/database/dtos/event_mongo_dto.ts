import { IEvent, EventModel } from "../models/event.model";
import { Event } from "../../../domain/entities/event";
import { STATUS } from "../../../domain/enums/status_enum";
import { CATEGORY } from "src/shared/domain/enums/category_enum";
import { PACKAGE_TYPE } from "src/shared/domain/enums/package_type_enum";
import { FEATURE } from "src/shared/domain/enums/feature_enum";
import { AGE_ENUM } from "src/shared/domain/enums/age_enum";
import { Address } from "src/shared/domain/entities/address";
import { MUSIC_TYPE } from "src/shared/domain/enums/music_type_enum";

export interface EventMongoDTOProps {
  _id: string;
  name: string;
  description: string;
  address: Address;
  price: number;
  ageRange: AGE_ENUM;
  eventDate: Date;
  instituteId: string;
  eventStatus: STATUS;
  musicType: MUSIC_TYPE[];
  menuLink?: string;
  eventPhotoLink?: string;
  galeryLink: string[];
  bannerUrl?: string;
  packageType: PACKAGE_TYPE[];
  category?: CATEGORY;
  ticketUrl?: string;
  features: FEATURE[];
  reviewsId: string[];
  presencesId: string[];
}

export class EventMongoDTO {
  _id: string;
  name: string;
  description: string;
  address: Address;
  price: number;
  ageRange: AGE_ENUM;
  eventDate: Date;
  instituteId: string;
  eventStatus: STATUS;
  musicType: MUSIC_TYPE[];
  menuLink?: string;
  eventPhotoLink?: string;
  galeryLink: string[];
  bannerUrl?: string;
  package_type: PACKAGE_TYPE[];
  category?: CATEGORY;
  ticketUrl?: string;
  features: FEATURE[];
  reviewsId: string[];
  presencesId: string[];

  constructor(props: EventMongoDTOProps) {
    this._id = props._id;
    this.instituteId = props.instituteId;
    this.name = props.name;
    this.bannerUrl = props.bannerUrl;
    this.address = props.address;
    this.price = props.price;
    this.description = props.description;
    this.ageRange = props.ageRange;
    this.eventDate = props.eventDate;
    this.eventStatus = props.eventStatus;
    this.musicType = props.musicType || [];
    this.menuLink = props.menuLink;
    this.eventPhotoLink = props.eventPhotoLink;
    this.galeryLink = props.galeryLink || [];
    this.package_type = props.packageType || [];
    this.category = props.category;
    this.ticketUrl = props.ticketUrl;
    this.features = props.features || [];
    this.reviewsId = props.reviewsId || [];
    this.presencesId = props.presencesId || [];
  }

  static fromMongo(eventDoc: any): EventMongoDTO {
    return new EventMongoDTO({
      _id: eventDoc._id,
      instituteId: eventDoc.instituteId,
      name: eventDoc.name,
      bannerUrl: eventDoc.bannerUrl,
      address: eventDoc.location,
      price: eventDoc.price,
      description: eventDoc.description,
      ageRange: eventDoc.ageRange,
      eventDate: eventDoc.eventDate,
      features: eventDoc.features,
      eventStatus: eventDoc.eventStatus,
      musicType: eventDoc.musicType,
      menuLink: eventDoc.menuLink,
      eventPhotoLink: eventDoc.eventPhotoLink,
      galeryLink: eventDoc.galeryLink,
      packageType: eventDoc.package_type,
      category: eventDoc.category,
      ticketUrl: eventDoc.ticketUrl,
      reviewsId: eventDoc.reviewsId,
      presencesId: eventDoc.presencesId,
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
      eventPhotoLink: this.eventPhotoLink,
      galeryLink: this.galeryLink || [],
      instituteId: this.instituteId,
      bannerUrl: this.bannerUrl,
      packageType: (this.package_type || []).map(
        (type) => type as PACKAGE_TYPE
      ),
      category: this.category as CATEGORY,
      ticketUrl: this.ticketUrl,
      reviewsId: this.reviewsId,
      presencesId: this.presencesId,
    });
  }

  static fromEntity(event: Event): EventMongoDTO {
    return new EventMongoDTO({
      _id: event.eventId,
      instituteId: event.instituteId,
      name: event.name,
      bannerUrl: event.bannerUrl,
      address: event.address,
      price: event.price,
      description: event.description,
      ageRange: event.ageRange,
      eventDate: event.eventDate,
      features: event.features,
      eventStatus: event.eventStatus,
      musicType: event.musicType,
      menuLink: event.menuLink || "",
      eventPhotoLink: event.eventPhotoLink || "",
      galeryLink: event.galeryLink || [],
      packageType: event.packageType || [],
      category: event.category,
      ticketUrl: event.ticketUrl || "",
      reviewsId: event.reviewsId,
      presencesId: event.presencesId,
    });
  }

  toMongo(): IEvent {
    return new EventModel({
      _id: this._id,
      instituteId: this.instituteId,
      name: this.name,
      bannerUrl: this.bannerUrl,
      location: this.address,
      price: this.price,
      description: this.description,
      ageRange: this.ageRange,
      eventDate: this.eventDate,
      features: this.features,
      eventStatus: this.eventStatus,
      musicType: this.musicType,
      menuLink: this.menuLink,
      eventPhotoLink: this.eventPhotoLink,
      galeryLink: this.galeryLink,
      package_type: this.package_type,
      category: this.category,
      ticketUrl: this.ticketUrl,
      createdAt: this.eventDate,
      reviewsId: this.reviewsId,
      presencesId: this.presencesId,
    });
  }
}
