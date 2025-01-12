import { Event } from '../../../domain/entities/event';
import { IEventRepository } from '../../../domain/repositories/event_repository_interface';
import { EventModel, IEvent } from '../models/event.model';
import { EventMongoDTO } from '../dtos/event_mongo_dto';
import {
  NoItemsFound,
  EntityError,
} from '../../../../../src/shared/helpers/errors/errors';

export class EventRepositoryMongo implements IEventRepository {

  async createEvent(event: Event): Promise<Event> {
    const eventDoc = EventMongoDTO.fromEntity(event).toMongo();
    const result = await EventModel.create(eventDoc);

    return EventMongoDTO.fromMongo(result).toEntity();
  }

  async deleteEvent(eventId: string): Promise<void> {
    const result = await EventModel.deleteOne({ _id: eventId });
    if (result.deletedCount === 0) {
      throw new NoItemsFound(`Evento com ID ${eventId} não encontrado.`);
    }
  }

  async getAllEvents(): Promise<Event[]> {
    const events = await EventModel.find().lean();

    return events.map((event) => EventMongoDTO.fromMongo(event).toEntity());
  }

  async getEventsByIds(eventIds: string[]): Promise<Event[]> {
    const events = await EventModel.find({ _id: { $in: eventIds } }).lean();

    return events.map((event) => EventMongoDTO.fromMongo(event).toEntity());
  }

  async getAllEventsFromToday(): Promise<Event[]> {
    const events = await EventModel.find({ eventDate: { $gte: new Date() } }).lean();

    return events.map((event) => EventMongoDTO.fromMongo(event).toEntity());
  }

  async getEventsByFilter(filter: any): Promise<Event[]> {
    const events = await EventModel.find(filter || {}).lean();

    return events.map((event) => EventMongoDTO.fromMongo(event).toEntity());
  }

  async getEventById(eventId: string): Promise<Event | null> {
    const event = await EventModel.findById(eventId).lean();

    return event ? EventMongoDTO.fromMongo(event).toEntity() : null;
  }

  async updateEvent(eventId: string, updatedFields: Partial<Event>): Promise<Event> {
    const sanitizedFields = Object.fromEntries(
      Object.entries(updatedFields).filter(([_, value]) => value != null)
    );

    sanitizedFields.updatedAt = new Date() as any;

    const result = await EventModel.findByIdAndUpdate(
      eventId,
      { $set: sanitizedFields },
      { new: true }
    ).lean();

    if (!result) {
      throw new NoItemsFound(`Evento com ID ${eventId} não encontrado para atualização.`);
    }

    return EventMongoDTO.fromMongo(result).toEntity();
  }
}
