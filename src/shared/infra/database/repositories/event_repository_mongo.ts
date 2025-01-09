import { Event } from "../../../domain/entities/event";
import { IEventRepository } from "../../../domain/repositories/event_repository_interface";
import { IEvent } from "../models/event.model";
import { EventMongoDTO } from "../dtos/event_mongo_dto";
import {
  NoItemsFound,
  ConflictItems,
} from "../../../../../src/shared/helpers/errors/errors";
import { Collection, Connection } from "mongoose";

export class EventRepositoryMongo implements IEventRepository {
  private eventCollection: Collection<IEvent>;

  constructor(connection: Connection) {
    this.eventCollection = connection.collection<IEvent>("Event");
  }

  async createEvent(event: Event): Promise<Event> {
    const eventDoc = EventMongoDTO.fromEntity(event).toMongo();

    const result = await this.eventCollection.insertOne(eventDoc);

    if (!result.acknowledged) {
      throw new Error("Erro ao criar evento no MongoDB.");
    }

    const createdEventDoc = await this.eventCollection.findOne({
      _id: event.eventId,
    });

    if (!createdEventDoc) {
      throw new Error("Erro ao buscar o evento criado no MongoDB.");
    }

    return EventMongoDTO.fromMongo(createdEventDoc).toEntity();
  }

  async deleteEvent(eventId: string): Promise<void> {
    const result = await this.eventCollection.deleteOne({ _id: eventId });

    if (!result.deletedCount || result.deletedCount === 0) {
      throw new NoItemsFound("Evento");
    }
  }

  async getAllEvents(): Promise<Event[]> {
    const events = await this.eventCollection.find().toArray();

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
}
