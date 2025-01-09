import { Address } from "src/shared/domain/entities/address";
import { Event } from "../../../shared/domain/entities/event";

export class EventViewModel {
  private eventId?: string;
  private name: string;
  private bannerUrl?: string;
  private address: Address;
  private price: number;
  private description: string;
  private ageRange: string;
  private eventDate: Date;
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

  constructor(event: Event) {
    this.eventId = event.getEventId;
    this.name = event.getEventName;
    this.bannerUrl = event.getEventBannerUrl;
    this.address = event.getEventLocation;
    this.price = event.getEventPrice;
    this.description = event.getEventDescription;
    this.ageRange = event.getEventAgeRange;
    this.eventDate = event.getEventDate;
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
  }

  toJSON() {
    return {
      eventId: this.eventId,
      name: this.name,
      bannerUrl: this.bannerUrl,
      location: {
        address: this.address.street,
        number: this.address.number,
        cep: this.address.cep,
        city: this.address.city,
        neighborhood: this.address.neighborhood,
        state: this.address.state,
        latitude: this.address.latitude,
        longitude: this.address.longitude,
      },
      price: this.price,
      description: this.description,
      ageRange: this.ageRange,
      eventDate: this.eventDate,
      instituteId: this.instituteId,
      features: this.features,
      musicType: this.musicType,
      menuLink: this.menuLink,
      eventPhotoLink: this.eventPhotoLink,
      galeryLink: this.galeryLink,
      packageType: this.packageType,
      category: this.category,
      ticketUrl: this.ticketUrl,
      rating:
        this.reviews != undefined
          ? this.reviews?.reduce((acc, review) => acc + review.rating, 0) /
            this.reviews?.length
          : 0,
    };
  }
}

export class GetAllConfirmedEventsViewModel {
  private events: EventViewModel[];

  constructor(events: Event[]) {
    this.events = events.map((event) => new EventViewModel(event));
  }

  toJSON() {
    return {
      events: this.events.map((event) => event.toJSON()),
      message: "All events have been retrieved successfully",
    };
  }
}
