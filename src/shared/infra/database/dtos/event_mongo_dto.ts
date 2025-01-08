import eventModel, { IEvent as EventDocument } from "../models/event.model";
import {
  Event
} from "../../../domain/entities/event";
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
}

export class EventMongoDTO {
  private _id: string;
  private name: string;
  private description: string;
  private address: Address;
  private price: number;
  private ageRange: AGE_ENUM;
  private eventDate: Date;
  private instituteId: string;
  private eventStatus: STATUS;
  private musicType: MUSIC_TYPE[];
  private menuLink?: string;
  private eventPhotoLink?: string;
  private galeryLink: string[];
  private bannerUrl?: string;
  private package_type: PACKAGE_TYPE[];
  private category?: CATEGORY;
  private ticketUrl?: string;
  private features: FEATURE[];
  private reviewsId: string[];

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
    });
  }

  static toEntity(eventMongoDTO: EventMongoDTO): Event {
    return new Event({
      eventId: eventMongoDTO._id,
      name: eventMongoDTO.name,
      description: eventMongoDTO.description,
      address: eventMongoDTO.address,
      price: eventMongoDTO.price,
      ageRange: eventMongoDTO.ageRange,
      eventDate: eventMongoDTO.eventDate,
      features: (eventMongoDTO.features || [])
        .filter((feature) => feature !== null)
        .map((feature) => feature as FEATURE),
      eventStatus: eventMongoDTO.eventStatus as STATUS,
      musicType: (eventMongoDTO.musicType || []).map(
        (type) => type as MUSIC_TYPE
      ),
      menuLink: eventMongoDTO.menuLink,
      eventPhotoLink: eventMongoDTO.eventPhotoLink,
      galeryLink: eventMongoDTO.galeryLink || [],
      instituteId: eventMongoDTO.instituteId,
      bannerUrl: eventMongoDTO.bannerUrl,
      packageType: (eventMongoDTO.package_type || []).map(
        (type) => type as PACKAGE_TYPE
      ),
      category: eventMongoDTO.category as CATEGORY,
      ticketUrl: eventMongoDTO.ticketUrl,
      reviewsId: eventMongoDTO.reviewsId
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
      reviewsId:
        event.reviewsId,
    });
  }

  static toMongo(eventMongoDTO: EventMongoDTO): EventDocument {
    const eventDocument = new eventModel({
      _id: eventMongoDTO._id,
      instituteId: eventMongoDTO.instituteId,
      name: eventMongoDTO.name,
      bannerUrl: eventMongoDTO.bannerUrl,
      location: eventMongoDTO.address,
      price: eventMongoDTO.price,
      description: eventMongoDTO.description,
      ageRange: eventMongoDTO.ageRange,
      eventDate: eventMongoDTO.eventDate,
      features: eventMongoDTO.features,
      eventStatus: eventMongoDTO.eventStatus,
      musicType: eventMongoDTO.musicType,
      menuLink: eventMongoDTO.menuLink,
      eventPhotoLink: eventMongoDTO.eventPhotoLink,
      galeryLink: eventMongoDTO.galeryLink,
      package_type: eventMongoDTO.package_type,
      category: eventMongoDTO.category,
      ticketUrl: eventMongoDTO.ticketUrl,
      createdAt: eventMongoDTO.eventDate,
      reviewsId: eventMongoDTO.reviewsId
    });

    return eventDocument as EventDocument;
  }
}
