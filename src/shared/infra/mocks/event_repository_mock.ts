import { NoItemsFound } from "src/shared/helpers/errors/usecase_errors";
import { Event } from "../../domain/entities/event";
import { IEventRepository } from "../../domain/irepositories/event_repository_interface";
import { EventMock } from "../../domain/mocks/event_mock";

export class EventRepositoryMock implements IEventRepository {
  private events: Event[];

  constructor() {
    const eventMock = new EventMock();
    this.events = eventMock.events;
  }
  updateEventBanner(eventId: string, bannerUrl: string): Promise<void> {
    throw new Error("Method not implemented.");
  }
  updateEvent(eventId: string, updatedFields: any): Promise<Event> {
    throw new Error("Method not implemented.");
  }

  async getEventsByUpcomingDates(dates: Date[]): Promise<Event[]> {
    if (!dates || dates.length === 0) {
      return [];
    }

    const upcomingEvents = this.events.filter((event) => {
      const eventDate = new Date(event.getEventDate);
      return dates.some(
        (date) => eventDate.toISOString() === date.toISOString()
      );
    });

    if (upcomingEvents.length === 0) {
      throw new NoItemsFound("eventos");
    }

    return upcomingEvents;
  }

  async createEvent(event: Event): Promise<string> {
    this.events.push(event);
    return event.getEventId;
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

      if (filter.name && event.getEventName !== filter.name) {
        matches = false;
      }
      if (filter.institute_id && event.getInstituteId !== filter.institute_id) {
        matches = false;
      }
      if (filter.price && event.getEventPrice !== filter.price) {
        matches = false;
      }
      if (filter.address && event.getEventAddress !== filter.address) {
        matches = false;
      }
      if (filter.age_range && event.getEventAgeRange !== filter.age_range) {
        matches = false;
      }
      if (
        filter.event_date &&
        new Date(event.getEventDate).toISOString() !==
          new Date(filter.event_date).toISOString()
      ) {
        matches = false;
      }
      if (
        filter.district_id &&
        event.getEventDistrictId !== filter.district_id
      ) {
        matches = false;
      }
      if (
        filter.music_type &&
        !event.getMusicType?.some((type) => filter.music_type.includes(type))
      ) {
        matches = false;
      }
      if (
        filter.features &&
        !event.getFeatures?.some((feature) => filter.features.includes(feature))
      ) {
        matches = false;
      }
      if (filter.category && event.getCategoryType !== filter.category) {
        matches = false;
      }
      if (filter.ticket_url && event.getTicketUrl !== filter.ticket_url) {
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
    const event = this.events.find((event) => event.getEventId === eventId);
    if (!event) {
      throw new NoItemsFound("event");
    }
    return event;
  }

  async deleteEventById(eventId: string): Promise<void> {
    const eventIndex = this.events.findIndex(
      (event) => event.getEventId === eventId
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
    const event = this.events.find((event) => event.getEventId === eventId);
    if (!event) {
      throw new NoItemsFound("event");
    }
    event.setEventPhotoLink = profilePhoto;
    return profilePhoto;
  }

  async updateGalleryArray(eventId: string, imageKey: string): Promise<void> {
    const event = this.events.find((event) => event.getEventId === eventId);
    if (!event) {
      throw new NoItemsFound("event");
    }
    if ((event.getGaleryLink?.length ?? 0) > 10) {
      throw new Error("Event gallery is full");
    }
    event.setGaleryLink.push(imageKey);
  }

  async countGalleryEvent(eventId: string): Promise<Number> {
    const event = this.events.find((event) => event.getEventId === eventId);
    if (!event) {
      throw new NoItemsFound("event");
    }
    return event.getGaleryLink ? event.getGaleryLink.length : 0;
  }

  async createReview(star: number, review: string, reviewedAt: Date, eventId: string, username: string, name: string, photoUrl: string): Promise<void> {
    const event = this.events.find((event) => event.getEventId === eventId);
    if (!event) {
      throw new NoItemsFound("event");
    }
  }

  async getAllConfirmedEvents(username: string): Promise<Event[]> {
    return this.events.filter((event) => event.getEventId?.includes(username));
  }
}
