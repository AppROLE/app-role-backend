import { PaginationReturn } from 'src/shared/helpers/types/event_pagination';
import { Event } from '../entities/event';

export interface IEventRepository {
  createEvent(event: Event): Promise<Event>;
  deleteEvent(eventId: string): Promise<void>;
  getAllEventsPaginated(page: number): Promise<PaginationReturn<Event>>;
  getAllEventsFromToday(page: number): Promise<PaginationReturn<Event>>;
  getEventsByFilter(
    page: number,
    filter: any
  ): Promise<PaginationReturn<Event>>;
  getEventsByIds(eventIds: string[]): Promise<Event[]>;
  getEventById(eventId: string): Promise<Event | null>;
  updateEvent(eventId: string, updatedFields: Partial<Event>): Promise<Event>;
}
