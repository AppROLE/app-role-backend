import { AGE_ENUM } from "src/shared/domain/enums/age_enum";
import { Event, LocationProps } from "../../../shared/domain/entities/event";

export class EventViewModel {
  private eventId?: string;
  private name: string;
  private bannerUrl?: string;
  private location: LocationProps;
  private price: number;
  private description: string;
  private ageRange: AGE_ENUM;
  private eventDate: Date;
  private instituteId: string;
  private features: string[];
  private musicType?: string[];
  private menuLink?: string;
  private galeryLink?: string[];
  private packageType?: string[];
  private category?: string;
  private ticketUrl?: string;
  private eventPhotoLink?: string;

  constructor(event: Event) {
    this.eventId = event.getEventId;
    this.name = event.getEventName;
    this.bannerUrl = event.getEventBannerUrl;
    this.location = event.getEventLocation;
    this.price = event.getEventPrice;
    this.description = event.getEventDescription;
    this.ageRange = event.getEventAgeRange;
    this.eventDate = event.getEventDate;
    this.instituteId = event.getInstituteId;
    this.features = event.getFeatures;
    this.musicType = event.getMusicType;
    this.menuLink = event.getMenuLink;
    this.galeryLink = event.getGaleryLink;
    this.packageType = event.getPackageType;
    this.category = event.getCategoryType;
    this.ticketUrl = event.getTicketUrl;
    this.eventPhotoLink = event.getEventPhotoLink;
  }

  toJSON() {
    return {
      eventId: this.eventId,
      name: this.name,
      bannerUrl: this.bannerUrl,
      location: {
        address: this.location.address,
        cep: this.location.cep,
        city: this.location.city,
        neighborhood: this.location.neighborhood,
        state: this.location.state,
        latitude: this.location.latitude,
        longitude: this.location.longitude,
      },
      price: this.price,
      description: this.description,
      ageRange: this.ageRange,
      eventDate: this.eventDate,
      instituteId: this.instituteId,
      features: this.features,
      musicType: this.musicType,
      menuLink: this.menuLink,
      galeryLink: this.galeryLink,
      packageType: this.packageType,
      category: this.category,
      ticketUrl: this.ticketUrl,
      eventPhotoLink: this.eventPhotoLink,
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
      message: "Todos os eventos foram recuperados com sucesso",
    };
  }
}
