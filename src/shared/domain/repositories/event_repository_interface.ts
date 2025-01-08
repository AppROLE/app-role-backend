import { Event } from "../entities/event";

export interface IEventRepository {
  createEvent(event: Event): Promise<string>;
  getAllEvents(): Promise<Event[]>;
  getAllEventsFromToday(page: number): Promise<Event[]>;
  getEventsByFilter(filter: any): Promise<Event[]>;
  getEventById(eventId: string): Promise<Event | undefined>;
  deleteEventById(eventId: string): Promise<void>;
  updateEventPhoto(eventId: string, profilePhoto: string): Promise<string>;
  updateGalleryArray(evenetId: string, pathName: string): Promise<void>;
  countGalleryEvent(eventId: string): Promise<Number>;
  getEventsByUpcomingDates(dates: Date[]): Promise<Event[]>;
  createReview(
    rating: number,
    review: string,
    createdAt: Date,
    eventId: string,
    name: string,
    photoUrl: string,
    username: string
  ): Promise<void>;
  getAllConfirmedEvents(
    username: string,
    isMyEvents: boolean,
    myUsername: string
  ): Promise<Event[]>;
  updateEvent(eventId: string, updatedFields: any): Promise<Event>;
  updateEventBanner(eventId: string, bannerUrl: string): Promise<void>;
}
