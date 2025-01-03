import { Event, ReviewProps } from "../../../shared/domain/entities/event";

export class EventViewModel {
  private eventId?: string;
  private name: string;
  private eventDate: Date;
  private eventPhotoLink?: string;
  private category?: string;
  private reviews?: ReviewProps[];

  constructor(event: Event) {
    this.eventId = event.getEventId;
    this.name = event.getEventName;
    this.eventDate = event.getEventDate;
    this.eventPhotoLink = event.getEventPhotoLink;
    this.category = event.getCategoryType;
    this.reviews = event.getReviews;
  }

  toJSON() {
    return {
      eventId: this.eventId,
      name: this.name,
      eventDate: this.eventDate,
      eventPhotoLink: this.eventPhotoLink,
      category: this.category,
      rating:
        this.reviews != undefined
          ? this.reviews?.reduce((acc, review) => acc + review.star, 0) /
            this.reviews?.length
          : 0,
    };
  }
}

export class GetAllEventsViewModel {
  private events: EventViewModel[];

  constructor(events: Event[]) {
    this.events = events.map((event) => new EventViewModel(event));
  }

  toJSON() {
    return {
      events: this.events.map((event) => event.toJSON()),
      message: "Todos os eventos foram retornados com sucesso",
    };
  }
}
