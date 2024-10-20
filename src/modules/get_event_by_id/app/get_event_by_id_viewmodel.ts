import { AGE_ENUM } from "src/shared/domain/enums/age_enum";
import { Event, ReviewProps } from "../../../shared/domain/entities/event";

export class GetEventByIdViewModel {
  private eventId?: string;
  private name: string;
  private bannerUrl?: string;
  private address: string;
  private price: number;
  private description: string;
  private ageRange: AGE_ENUM;
  private eventDate: Date;
  private districtId: string;
  private instituteId: string;
  private features: string[];
  private musicType?: string[];
  private menuLink?: string;
  private eventPhotoLink?: string;
  private galeryLink?: string[];
  private packageType?: string[];
  private category?: string;
  private ticketUrl?: string;
  private reviews?: ReviewProps[];
  private eventStatus: string;

  constructor(event: Event) {
    this.eventId = event.getEventId;
    this.name = event.getEventName;
    this.bannerUrl = event.getEventBannerUrl;
    this.address = event.getEventAddress;
    this.price = event.getEventPrice;
    this.description = event.getEventDescription;
    this.ageRange = event.getEventAgeRange;
    this.eventDate = event.getEventDate;
    this.districtId = event.getEventDistrictId;
    this.instituteId = event.getInstituteId;
    this.features = event.getFeatures;
    this.musicType = event.getMusicType;
    this.menuLink = event.getMenuLink;
    this.eventPhotoLink = event.getEventPhotoLink;
    this.galeryLink = event.getGaleryLink;
    this.packageType = event.getPackageType;
    this.category = event.getCategoryType;
    this.ticketUrl = event.getTicketUrl;
    this.reviews = event.getReviews;
    this.eventStatus = event.getEventStatus;
  }

  toJSON() {
    return {
      eventId: this.eventId,
      name: this.name,
      bannerUrl: this.bannerUrl,
      address: this.address,
      price: this.price,
      description: this.description,
      ageRange: this.ageRange,
      eventDate: this.eventDate,
      districtId: this.districtId,
      instituteId: this.instituteId,
      features: this.features,
      musicType: this.musicType,
      menuLink: this.menuLink,
      eventPhotoLink: this.eventPhotoLink,
      galeryLink: this.galeryLink,
      packageType: this.packageType,
      category: this.category,
      ticketUrl: this.ticketUrl,
      rating: this.reviews != undefined ? this.reviews?.reduce((acc, review) => acc + review.star, 0) / this.reviews?.length : 0,
      reviews: this.reviews,
      eventStatus: this.eventStatus,
    };
  }
}
