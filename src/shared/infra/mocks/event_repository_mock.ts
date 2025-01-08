import { NoItemsFound } from "src/shared/helpers/errors/errors";
import { Event } from "../../domain/entities/event";
import { IEventRepository } from "../../domain/repositories/event_repository_interface";
import { EventMock } from "../../domain/mocks/event_mock";

export class EventRepositoryMock implements IEventRepository {
  private events: Event[];

  constructor() {
    const eventMock = new EventMock();
    this.events = eventMock.events;
  }
  getAllEventsFromToday(page: number): Promise<Event[]> {
    throw new Error("Method not implemented.");
  }
  getEventsByUpcomingDates(dates: Date[]): Promise<Event[]> {
    throw new Error("Method not implemented.");
  }
  updateEvent(eventId: string, updatedFields: any): Promise<Event> {
    throw new Error("Method not implemented.");
  }
  updateEventBanner(eventId: string, bannerUrl: string): Promise<void> {
    throw new Error("Method not implemented.");
  }

  async createEvent(event: Event): Promise<string> {
    this.events.push(event);
    return event.eventId;
  }

  async getAllEvents(): Promise<Event[]> {
    return [...this.events];
  }

  async getEventsByFilter(filter: any): Promise<Event[]> {
    if (!filter || Object.keys(filter).length === 0) {
      return [...this.events];
    }

    const filteredEvents = this.events.filter((event) => {
      let matches = true;

      if (filter.name && event.name !== filter.name) {
        matches = false;
      }
      if (filter.instituteId && event.instituteId !== filter.instituteId) {
        matches = false;
      }
      if (filter.price && event.price !== filter.price) {
        matches = false;
      }
      if (filter.ageRange && event.ageRange !== filter.ageRange) {
        matches = false;
      }
      if (
        filter.eventDate &&
        new Date(event.eventDate).toISOString() !==
          new Date(filter.eventDate).toISOString()
      ) {
        matches = false;
      }
      if (
        filter.musicType &&
        !event.musicType?.some((type) => filter.musicType.includes(type))
      ) {
        matches = false;
      }
      if (
        filter.features &&
        !event.features?.some((feature) => filter.features.includes(feature))
      ) {
        matches = false;
      }
      if (filter.category && event.category !== filter.category) {
        matches = false;
      }
      if (filter.ticketUrl && event.ticketUrl !== filter.ticketUrl) {
        matches = false;
      }

      return matches;
    });

    if (filteredEvents.length === 0) {
      throw new NoItemsFound("evento");
    }

    return filteredEvents;
  }

  async getEventById(eventId: string): Promise<Event> {
    const event = this.events.find((event) => event.eventId === eventId);
    if (!event) {
      throw new NoItemsFound("event");
    }
    return event;
  }

  async deleteEventById(eventId: string): Promise<void> {
    const eventIndex = this.events.findIndex(
      (event) => event.eventId === eventId
    );
    if (eventIndex === -1) {
      throw new NoItemsFound("event");
    }
    this.events.splice(eventIndex, 1);
  }

  async updateEventPhoto(
    eventId: string,
    profilePhoto: string
  ): Promise<string> {
    const event = this.events.find((event) => event.eventId === eventId);
    if (!event) {
      throw new NoItemsFound("event");
    }
    event.eventPhotoLink = profilePhoto;
    return profilePhoto;
  }

  async updateGalleryArray(eventId: string, imageKey: string): Promise<void> {
    const event = this.events.find((event) => event.eventId === eventId);
    if (!event) {
      throw new NoItemsFound("event");
    }
    if ((event.galeryLink?.length ?? 0) > 10) {
      throw new Error("Event gallery is full");
    }
    event.galeryLink?.push(imageKey);
  }

  async countGalleryEvent(eventId: string): Promise<Number> {
    const event = this.events.find((event) => event.eventId === eventId);
    if (!event) {
      throw new NoItemsFound("event");
    }
    return event.galeryLink ? event.galeryLink.length : 0;
  }

  async createReview(
    rating: number,
    review: string,
    createdAt: Date,
    eventId: string,
    username: string,
    name: string,
    photoUrl: string
  ): Promise<void> {
    const event = this.events.find((event) => event.eventId === eventId);
    if (!event) {
      throw new NoItemsFound("event");
    }
  }

  async getAllConfirmedEvents(username: string): Promise<Event[]> {
    return this.events.filter((event) => event.eventId?.includes(username));
  }
}
