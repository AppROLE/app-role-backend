import { AGE_ENUM } from 'src/shared/domain/enums/age_enum';
import { Event } from '../../../shared/domain/entities/event';
import { Address } from 'src/shared/domain/entities/address';
import { STATUS } from 'src/shared/domain/enums/status_enum';
import { MUSIC_TYPE } from 'src/shared/domain/enums/music_type_enum';
import { CATEGORY } from 'src/shared/domain/enums/category_enum';
import { PACKAGE_TYPE } from 'src/shared/domain/enums/package_type_enum';
import { FEATURE } from 'src/shared/domain/enums/feature_enum';

export class EventViewModel {
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
  galeryLink: string[];
  packageType: PACKAGE_TYPE[];
  category?: CATEGORY;
  ticketUrl?: string;
  features: FEATURE[];
  reviewsId: string[];
  presencesId: string[];
  createdAt: number;
  updatedAt: number;

  constructor(event: Event) {
    this.eventId = event.eventId;
    this.name = event.name;
    this.description = event.description;
    this.address = event.address;
    this.price = event.price;
    this.ageRange = event.ageRange;
    this.eventDate = event.eventDate;
    this.instituteId = event.instituteId;
    this.eventStatus = event.eventStatus;
    this.musicType = event.musicType;
    this.menuLink = event.menuLink;
    this.eventPhoto = event.eventPhoto;
    this.galeryLink = event.galeryLink;
    this.packageType = event.packageType;
    this.category = event.category;
    this.ticketUrl = event.ticketUrl;
    this.features = event.features;
    this.reviewsId = event.reviewsId;
    this.presencesId = event.presencesId;
    this.createdAt = event.createdAt;
    this.updatedAt = event.updatedAt;
  }

  toJSON() {
    return {
      eventId: this.eventId,
      name: this.name,
      description: this.description,
      address: {
        street: this.address.street,
        number: this.address.number,
        cep: this.address.cep,
        city: this.address.city,
        neighborhood: this.address.neighborhood,
        state: this.address.state,
        latitude: this.address.latitude,
        longitude: this.address.longitude,
      },
      price: this.price,
      ageRange: this.ageRange,
      eventDate: this.eventDate,
      instituteId: this.instituteId,
      eventStatus: this.eventStatus,
      musicType: this.musicType,
      menuLink: this.menuLink,
      eventPhoto: this.eventPhoto,
      galeryLink: this.galeryLink,
      packageType: this.packageType,
      category: this.category,
      ticketUrl: this.ticketUrl,
      features: this.features,
      reviewsId: this.reviewsId,
      presencesId: this.presencesId,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };
  }
}

export class GetAllEventsByFilterViewModel {
  private events: EventViewModel[];

  constructor(events: Event[]) {
    this.events = events.map((event) => new EventViewModel(event));
  }

  toJSON() {
    return {
      events: this.events.map((event) => event.toJSON()),
      message: 'Todos os eventos foram recuperados com sucesso',
    };
  }
}
