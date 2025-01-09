import { Event } from '../../../domain/entities/event';
import { IEventRepository } from '../../../domain/repositories/event_repository_interface';
import { IEvent } from '../models/event.model';
import { EventMongoDTO } from '../dtos/event_mongo_dto';
import {
  NoItemsFound,
  ConflictItems,
  EntityError,
} from '../../../../../src/shared/helpers/errors/errors';
import { Collection, Connection } from 'mongoose';

export class EventRepositoryMongo implements IEventRepository {
  private eventCollection: Collection<IEvent>;

  constructor(connection: Connection) {
    this.eventCollection = connection.collection<IEvent>('Event');
  }

  async createEvent(event: Event): Promise<Event> {
    const eventDoc = EventMongoDTO.fromEntity(event).toMongo();

    const result = await this.eventCollection.insertOne(eventDoc);

    if (!result.acknowledged) {
      throw new Error('Erro ao criar evento no MongoDB.');
    }

    const createdEvent = await this.getEventById(event.eventId);

    if (!createdEvent) {
      throw new Error('Erro ao buscar o evento criado no MongoDB.');
    }

    return createdEvent;
  }

  async deleteEvent(eventId: string): Promise<void> {
    const result = await this.eventCollection.deleteOne({ _id: eventId });

    if (!result.deletedCount || result.deletedCount === 0) {
      throw new NoItemsFound('Evento');
    }
  }

  async getAllEvents(): Promise<Event[]> {
    const events = await this.eventCollection.find().toArray();

    if (!events || events.length === 0) {
      return [];
    }

    return events.map((event) => EventMongoDTO.fromMongo(event).toEntity());
  }

  async getEventsByIds(eventIds: string[]): Promise<Event[]> {
    const events = await this.eventCollection
      .find({ _id: { $in: eventIds } })
      .toArray();

    if (!events || events.length === 0) {
      return [];
    }

    return events.map((event) => EventMongoDTO.fromMongo(event).toEntity());
  }

  async getAllEventsFromToday(): Promise<Event[]> {
    const events = await this.eventCollection
      .find({ getEventDate: { eventDate: new Date() } })
      .toArray();

    if (!events || events.length === 0) {
      return [];
    }

    return events.map((event) => EventMongoDTO.fromMongo(event).toEntity());
  }

  async getEventsByFilter(filter: any): Promise<Event[]> {
    if (!filter || Object.keys(filter).length === 0) {
      return await this.getAllEvents();
    }

    const events = await this.eventCollection.find(filter).toArray();

    if (!events || events.length === 0) {
      return [];
    }

    return events.map((event) => EventMongoDTO.fromMongo(event).toEntity());
  }

  async getEventById(eventId: string): Promise<Event | null> {
    const eventDoc = await this.eventCollection.findOne({ _id: eventId });

    if (!eventDoc) {
      return null;
    }

    return EventMongoDTO.fromMongo(eventDoc).toEntity();
  }

  async updateEvent(
    eventId: string,
    updatedFields: Partial<Event>
  ): Promise<Event> {
    const updateData = { ...updatedFields };

    const result = await this.eventCollection.updateOne(
      { _id: eventId },
      { $set: updateData }
    );

    if (result.matchedCount === 0) {
      throw new EntityError(`Event with id ${eventId} not found`);
    }

    const updatedEvent = await this.getEventById(eventId);
    if (!updatedEvent) {
      throw new EntityError(`Failed to fetch updated event with id ${eventId}`);
    }

    return updatedEvent;
  }
}
