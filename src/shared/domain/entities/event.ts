import { EntityError } from "../../helpers/errors/errors";
import { STATUS } from "../../domain/enums/status_enum";
import { FEATURE } from "../enums/feature_enum";
import { CATEGORY } from "../enums/category_enum";
import { PACKAGE_TYPE } from "../enums/package_type_enum";
import { AGE_ENUM } from "../enums/age_enum";
import { Address } from "./address";
import { MUSIC_TYPE } from "../enums/music_type_enum";

interface EventProps {
  eventId: string;
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

export class Event {
  eventId: string;
  name: string;
  description: string;
  address: Address;
  price: number;
  ageRange: AGE_ENUM;
  eventDate: Date; // e.g., new Date('2023-10-01T00:00:00Z')
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

  constructor(props: EventProps) {
    this.eventId = props.eventId;
    this.name = props.name;
    this.description = props.description;
    this.address = props.address;
    this.price = props.price;
    this.ageRange = props.ageRange;
    this.eventDate = props.eventDate;
    this.instituteId = props.instituteId;
    this.eventStatus = props.eventStatus;
    this.musicType = props.musicType;
    this.menuLink = props.menuLink;
    this.eventPhotoLink = props.eventPhotoLink;
    this.galeryLink = props.galeryLink;
    this.bannerUrl = props.bannerUrl;
    this.features = props.features || [];
    this.packageType = props.packageType || [];
    this.category = props.category;
    this.ticketUrl = props.ticketUrl;
    this.reviewsId = props.reviewsId || [];
  }

  private validateName(name: string): void {
    if (!name || name.trim().length === 0 || name.trim().length > 100) {
      throw new EntityError("Invalid event name");
    }
  }

  private validateDescription(description: string): void {
    if (!description || description.trim().length > 500) {
      throw new EntityError("Invalid event description");
    }
  }

  static validatePrice(price: number): void {
    if (price < 0 || price > 6) {
      throw new EntityError("preço");
    }
  }

  static validateAgeRange(ageRange: AGE_ENUM): void {
    if (!ageRange || !Object.values(AGE_ENUM).includes(ageRange)) {
      throw new EntityError("faixa etária");
    }
  }

  static validateEventDate(eventDate: Date | string) {
    if (typeof eventDate === "string") {
      eventDate = new Date(eventDate);
      if (!(eventDate instanceof Date) || isNaN(eventDate.getTime())) {
        return false;
      }
      return true;
    }
  }

  static validateInstituteId(instituteId: string): void {
    if (!instituteId || instituteId.trim().length === 0) {
      throw new EntityError("institute ID");
    }
  }

  static validateEventStatus(eventStatus: STATUS): void {
    if (!Object.values(STATUS).includes(eventStatus)) {
      throw new EntityError("event status");
    }
  }

  static validateMusicType(musicType: MUSIC_TYPE[]): void {
    musicType.forEach((type) => {
      if (!Object.values(musicType).includes(type)) {
        throw new EntityError("music type");
      }
    });
  }

  static validatePackageType(packageType: PACKAGE_TYPE): void {
    if (!Object.values(PACKAGE_TYPE).includes(packageType)) {
      throw new EntityError("package type");
    }
  }

  static validateMenuLink(menuLink: string): void {
    if (!menuLink || menuLink.trim().length === 0) {
      throw new EntityError("menu link");
    }
  }

  static validateTicketUrl(ticketUrl: string): void {
    if (!ticketUrl || ticketUrl.trim().length === 0) {
      throw new EntityError("ticket URL");
    }
  }

  static validateCategory(category: CATEGORY): void {
    if (!Object.values(CATEGORY).includes(category)) {
      throw new EntityError("category");
    }
  }
}
