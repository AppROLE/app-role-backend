import { Address } from '../entities/address';
import { Event } from '../entities/event';
import { AGE_ENUM } from '../enums/age_enum';
import { CATEGORY } from '../enums/category_enum';
import { FEATURE } from '../enums/feature_enum';
import { MUSIC_TYPE } from '../enums/music_type_enum';
import { PACKAGE_TYPE } from '../enums/package_type_enum';
import { STATUS } from '../enums/status_enum';

export interface IEventRepository {
  createEvent(event: Event): Promise<Event>;
  deleteEvent(eventId: string): Promise<void>;
  getAllEvents(): Promise<Event[]>;
  getEventsByIds(eventIds: string[]): Promise<Event[]>;
  getAllEventsFromToday(): Promise<Event[]>;
  getEventsByFilter(filter: any): Promise<Event[]>;
  getEventById(eventId: string): Promise<Event | null>;
  updateEvent(eventId: string, updatedFields: Partial<Event>): Promise<Event>;
}
