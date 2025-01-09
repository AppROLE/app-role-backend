import { Event } from "../entities/event";

export interface IEventRepository {
  createEvent(event: Event): Promise<Event>;
  deleteEvent(eventId: string): Promise<void>;
  getAllEvents(): Promise<Event[]>;
  getAllEventsFromToday(): Promise<Event[]>;
  getEventsByFilter(filter: any): Promise<Event[]>;
  getEventById(eventId: string): Promise<Event | null>;
}
