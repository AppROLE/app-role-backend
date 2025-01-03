import eventModel, { IEvent as EventDocument } from "../models/event.model";
import {
  Event,
  LocationProps,
  ReviewProps,
} from "../../../domain/entities/event";
import { STATUS } from "../../../domain/enums/status_enum";
import { MUSIC_TYPE } from "src/shared/domain/enums/music_type_enum";
import { CATEGORY } from "src/shared/domain/enums/category_enum";
import { PACKAGE_TYPE } from "src/shared/domain/enums/package_type_enum";
import { FEATURE } from "src/shared/domain/enums/feature_enum";
import { AGE_ENUM } from "src/shared/domain/enums/age_enum";

export interface EventMongoDTOProps {
  _id: string;
  institute_id: string;
  name: string;
  banner_url: string | undefined;
  location: LocationProps;
  price: number;
  description: string;
  age_range: AGE_ENUM;
  event_date: Date;
  features: string[];
  eventStatus: string;
  music_type: string[];
  menu_link: string;
  event_photo_link?: string;
  galery_link: string[];
  package_type?: string[];
  category?: string;
  ticket_url?: string;
  reviews: ReviewProps[];
}

export class EventMongoDTO {
  private _id: string;
  private institute_id: string;
  private name: string;
  private banner_url: string;
  private location: LocationProps;
  private price: number;
  private description: string;
  private age_range: AGE_ENUM;
  private event_date: Date;
  private features: string[];
  private eventStatus: string;
  private music_type: string[];
  private menu_link: string;
  private event_photo_link?: string;
  private galery_link: string[];
  private package_type: string[];
  private category?: string;
  private ticketUrl?: string;
  private reviews: ReviewProps[];

  constructor(props: EventMongoDTOProps) {
    this._id = props._id;
    this.institute_id = props.institute_id;
    this.name = props.name;
    this.banner_url = props.banner_url || "";
    this.location = props.location;
    this.price = props.price;
    this.description = props.description;
    this.age_range = props.age_range;
    this.event_date = props.event_date;
    this.features = props.features;
    this.eventStatus = props.eventStatus;
    this.music_type = props.music_type || [];
    this.menu_link = props.menu_link;
    this.event_photo_link = props.event_photo_link || "";
    this.galery_link = props.galery_link;
    this.package_type = props.package_type || [];
    this.category = props.category;
    this.ticketUrl = props.ticket_url || "";
    this.reviews = props.reviews;
  }

  static fromMongo(eventDoc: any): EventMongoDTO {
    return new EventMongoDTO({
      _id: eventDoc._id,
      institute_id: eventDoc.institute_id,
      name: eventDoc.name,
      banner_url: eventDoc.banner_url,
      location: eventDoc.location,
      price: eventDoc.price,
      description: eventDoc.description,
      age_range: eventDoc.age_range,
      event_date: eventDoc.event_date,
      features: eventDoc.features || [],
      eventStatus: eventDoc.eventStatus,
      music_type: eventDoc.music_type || [],
      menu_link: eventDoc.menu_link,
      event_photo_link: eventDoc.event_photo_link,
      galery_link: eventDoc.galery_link || [],
      package_type: eventDoc.package_type || [],
      category: eventDoc.category,
      ticket_url: eventDoc.ticket_url || "",
      reviews: eventDoc.reviews || [],
    });
  }

  static toEntity(eventMongoDTO: EventMongoDTO): Event {
    return new Event({
      eventId: eventMongoDTO._id,
      name: eventMongoDTO.name,
      description: eventMongoDTO.description,
      location: eventMongoDTO.location,
      price: eventMongoDTO.price,
      ageRange: eventMongoDTO.age_range,
      eventDate: eventMongoDTO.event_date,
      features: (eventMongoDTO.features || [])
        .filter((feature) => feature !== null)
        .map((feature) => feature as FEATURE),
      eventStatus: eventMongoDTO.eventStatus as STATUS,
      musicType: (eventMongoDTO.music_type || []).map(
        (type) => type as MUSIC_TYPE
      ),
      menuLink: eventMongoDTO.menu_link,
      eventPhotoLink: eventMongoDTO.event_photo_link,
      galeryLink: eventMongoDTO.galery_link || [],
      instituteId: eventMongoDTO.institute_id,
      bannerUrl: eventMongoDTO.banner_url,
      packageType: (eventMongoDTO.package_type || []).map(
        (type) => type as PACKAGE_TYPE
      ),
      category: eventMongoDTO.category as CATEGORY,
      ticketUrl: eventMongoDTO.ticketUrl,
      reviews: (eventMongoDTO.reviews || []).map((review) => ({
        username: review.username,
        name: review.name,
        star: review.star,
        photoUrl: review.photoUrl,
        review: review.review,
        reviewedAt: review.reviewedAt,
      })),
    });
  }

  static fromEntity(event: Event): EventMongoDTO {
    return new EventMongoDTO({
      _id: event.getEventId as string,
      institute_id: event.getInstituteId,
      name: event.getEventName,
      banner_url: event.getEventBannerUrl,
      location: event.getEventLocation,
      price: event.getEventPrice,
      description: event.getEventDescription,
      age_range: event.getEventAgeRange,
      event_date: event.getEventDate,
      features: event.getFeatures,
      eventStatus: event.getEventStatus,
      music_type: event.getMusicType || [],
      menu_link: event.getMenuLink || "",
      event_photo_link: event.getEventPhotoLink || "",
      galery_link: event.getGaleryLink || [],
      package_type: event.getPackageType || [],
      category: event.getCategoryType,
      ticket_url: event.getTicketUrl || "",
      reviews:
        event.getReviews?.map((review) => ({
          username: review.username,
          name: review.name,
          photoUrl: review.photoUrl,
          star: review.star,
          review: review.review,
          reviewedAt: review.reviewedAt,
        })) || [],
    });
  }

  static toMongo(eventMongoDTO: EventMongoDTO): EventDocument {
    const eventDocument = new eventModel({
      _id: eventMongoDTO._id,
      institute_id: eventMongoDTO.institute_id,
      name: eventMongoDTO.name,
      banner_url: eventMongoDTO.banner_url,
      location: eventMongoDTO.location,
      price: eventMongoDTO.price,
      description: eventMongoDTO.description,
      age_range: eventMongoDTO.age_range,
      event_date: eventMongoDTO.event_date,
      features: eventMongoDTO.features,
      eventStatus: eventMongoDTO.eventStatus,
      music_type: eventMongoDTO.music_type,
      menu_link: eventMongoDTO.menu_link,
      event_photo_link: eventMongoDTO.event_photo_link,
      galery_link: eventMongoDTO.galery_link,
      package_type: eventMongoDTO.package_type,
      category: eventMongoDTO.category,
      ticket_url: eventMongoDTO.ticketUrl,
      created_at: new Date(),
      reviews: eventMongoDTO.reviews.map((review) => ({
        username: review.username,
        star: review.star,
        review: review.review,
        reviewed_at: review.reviewedAt,
      })),
    });

    return eventDocument as EventDocument;
  }
}
