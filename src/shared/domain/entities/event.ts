import { EntityError } from "../../helpers/errors/domain_errors";
import { STATUS } from "../../domain/enums/status_enum";
import { FEATURE } from "../enums/feature_enum";
import { CATEGORY } from "../enums/category_enum";
import { MUSIC_TYPE } from "../enums/music_type_enum";
import { PACKAGE_TYPE } from "../enums/package_type_enum";
import { AGE_ENUM } from "../enums/age_enum";

export interface ReviewProps {
  username: string;
  star: number;
  review: string;
  name: string;
  photoUrl: string;
  reviewedAt?: Date;
}

interface EventProps {
  eventId: string;
  name: string;
  description: string;
  address: string;
  price: number;
  ageRange: AGE_ENUM;
  eventDate: Date; // e.g., new Date('2023-10-01T00:00:00Z')
  districtId: string;
  instituteId: string;
  eventStatus: STATUS;
  musicType?: MUSIC_TYPE[];
  menuLink?: string;
  eventPhotoLink?: string;
  galeryLink?: string[];
  bannerUrl?: string;
  features?: FEATURE[];
  packageType?: PACKAGE_TYPE[];
  category?: CATEGORY;
  ticketUrl?: string;
  reviews?: ReviewProps[];
}

export class Event {
  private eventId: string;
  private name: string;
  private description: string;
  private bannerUrl?: string;
  private address: string;
  private price: number;
  private ageRange: AGE_ENUM;
  private eventDate: Date;
  private districtId: string;
  private instituteId: string;
  private eventStatus: STATUS;
  private musicType?: MUSIC_TYPE[];
  private menu_link?: string;
  private event_photo_link?: string;
  private galery_link?: string[];
  private features_list: string[];
  private packageType?: PACKAGE_TYPE[];
  private category?: CATEGORY;
  private ticketUrl?: string;
  private reviews?: ReviewProps[];

  constructor(props: EventProps) {
    this.validate(props);

      this.eventId = props.eventId;
    this.name = props.name;
    this.description = props.description;
    this.address = props.address;
    this.price = props.price;
    this.ageRange = props.ageRange;
    this.eventDate = props.eventDate;
    this.districtId = props.districtId;
    this.instituteId = props.instituteId;
    this.eventStatus = props.eventStatus;
    this.musicType = props.musicType;
    this.menu_link = props.menuLink;
    this.event_photo_link = props.eventPhotoLink;
    this.galery_link = props.galeryLink;
    this.bannerUrl = props.bannerUrl;
    this.features_list = props.features || [];
    this.packageType = props.packageType || [];
    this.category = props.category;
    this.ticketUrl = props.ticketUrl;
    this.reviews = props.reviews || [];
  }

  get getEventId(): string {
    return this.eventId;
  }

  get getEventName(): string {
    return this.name;
  }

  get getEventStatus(): STATUS {
    return this.eventStatus;
  }

  get getEventDescription(): string {
    return this.description;
  }

  get getEventBannerUrl(): string | undefined {
    return this.bannerUrl;
  }

  get getEventAddress(): string {
    return this.address;
  }

  get getEventPrice(): number {
    return this.price;
  }

  get getEventAgeRange(): AGE_ENUM {
    return this.ageRange;
  }

  get getEventDate(): Date {
    return this.eventDate;
  }

  get getEventDistrictId(): string {
    return this.districtId;
  }

  get getInstituteId(): string {
    return this.instituteId;
  }

  get getFeatures(): string[] {
    return this.features_list;
  }

  get getPackageType(): PACKAGE_TYPE[] | undefined {
    return this.packageType;
  }

  get getCategoryType(): CATEGORY | undefined {
    return this.category;
  }

  get getMusicType(): MUSIC_TYPE[] | undefined {
    return this.musicType;
  }

  get getMenuLink(): string | undefined {
    return this.menu_link;
  }

  get getEventPhotoLink(): string | undefined {
    return this.event_photo_link;
  }

  get getGaleryLink(): string[] | undefined {
    return this.galery_link;
  }

  get getTicketUrl(): string | undefined {
    return this.ticketUrl;
  }

  get getReviews(): ReviewProps[] | undefined {
    return this.reviews;
  }

  set setEventName(name: string) {
    this.validateName(name);
    this.name = name;
  }

  set setEventDescription(description: string) {
    this.validateDescription(description);
    this.description = description;
  }

  set setEventBannerUrl(bannerUrl: string) {
    this.bannerUrl = bannerUrl;
  }

  set setEventAddress(address: string) {
    this.validateAddress(address);
    this.address = address;
  }

  set setEventPrice(price: number) {
    Event.validatePrice(price);
    this.price = price;
  }

  set setEventAgeRange(ageRange: AGE_ENUM) {
    Event.validateAgeRange(ageRange);
    this.ageRange = ageRange;
  }

  set setEventDate(eventDate: Date) {
    if (!Event.validateEventDate(eventDate)) {
      throw new EntityError("Invalid event date");
    }
    this.eventDate = eventDate;
  }

  set setEventDistrictId(districtId: string) {
    Event.validateDistrictId(districtId);
    this.districtId = districtId;
  }

  set setInstituteId(instituteId: string) {
    Event.validateInstituteId(instituteId);
    this.instituteId = instituteId;
  }

  set setEventStatus(eventStatus: STATUS) {
    Event.validateEventStatus(eventStatus);
    this.eventStatus = eventStatus;
  }

  set setFeatures(features: string[]) {
    this.features_list = features;
  }

  set setPackageType(packageType: PACKAGE_TYPE[]) {
    packageType.forEach((type) => {
      Event.validatePackageType(type);
    });
    this.packageType = packageType;
  }

  set setMusicType(musicType: MUSIC_TYPE[]) {
    Event.validateMusicType(musicType);
    this.musicType = musicType;
  }

  set setMenuLink(menuLink: string) {
    Event.validateMenuLink(menuLink);
    this.menu_link = menuLink;
  }

  set setEventPhotoLink(eventPhotoLink: string) {
    Event.validateMenuLink(eventPhotoLink);
    this.event_photo_link = eventPhotoLink;
  }

  set setGaleryLink(galeryLink: string[]) {
    this.galery_link = galeryLink;
  }

  set setCategoryType(category: CATEGORY) {
    Event.validateCategory(category);
    this.category = category;
  }

  set setTicketUrl(ticketUrl: string) {
    Event.validateTicketUrl(ticketUrl);
    this.ticketUrl = ticketUrl;
  }

  set setReviews(reviews: ReviewProps[]) {
    this.reviews = reviews;
  }

  private validate(props: EventProps): void {
    this.validateName(props.name);
    this.validateDescription(props.description);
    this.validateAddress(props.address);
    Event.validatePrice(props.price);
    Event.validateAgeRange(props.ageRange);
    Event.validateEventDate(props.eventDate);
    Event.validateDistrictId(props.districtId);
    Event.validateInstituteId(props.instituteId);
    Event.validateEventStatus(props.eventStatus);

    if (props.musicType) {
      Event.validateMusicType(props.musicType);
    }
    if (props.menuLink) {
      Event.validateMenuLink(props.menuLink);
    }
    if (props.eventPhotoLink) {
      Event.validateMenuLink(props.eventPhotoLink);
    }
    if (props.packageType) {
      props.packageType.forEach((type) => {
        Event.validatePackageType(type);
      });
    }
    if (props.category) {
      Event.validateCategory(props.category);
    }
    if (props.ticketUrl) {
      Event.validateTicketUrl(props.ticketUrl);
    }
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

  private validateAddress(address: string): void {
    if (
      !address ||
      address.trim().length === 0 ||
      address.trim().length > 255
    ) {
      throw new EntityError("Invalid address");
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

  static validateDistrictId(districtId: string): void {
    if (!districtId || districtId.trim().length === 0) {
      throw new EntityError("district ID");
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
      if (!Object.values(MUSIC_TYPE).includes(type)) {
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
