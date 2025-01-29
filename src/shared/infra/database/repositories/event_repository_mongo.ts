import { Event } from '../../../domain/entities/event';
import { IEventRepository } from '../../../domain/repositories/event_repository_interface';
import { EventModel, IEvent } from '../models/event.model';
import { EventMongoDTO } from '../dtos/event_mongo_dto';
import {
  NoItemsFound,
  EntityError,
} from '../../../../../src/shared/helpers/errors/errors';
import { PaginationReturn } from 'src/shared/helpers/types/event_pagination';

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

  async getAllEventsPaginated(page: number): Promise<PaginationReturn<Event>> {
    const limit = 30;
    const skip = (page - 1) * limit;

    const [events, totalCount] = await Promise.all([
      EventModel.find()
        .sort({ eventDate: -1 }) // Ordena pelo campo eventDate em ordem decrescente
        .skip(skip)
        .limit(limit)
        .lean(),
      EventModel.countDocuments(),
    ]);

    const totalPages = Math.ceil(totalCount / limit);

    return {
      items: events.map((event) => EventMongoDTO.fromMongo(event).toEntity()),
      totalPages,
      totalCount,
      prevPage: page > 1 ? page - 1 : null,
      nextPage: page < totalPages ? page + 1 : null,
    };
  }

  async getAllEventsFromToday(page: number): Promise<PaginationReturn<Event>> {
    const limit = 30;
    const skip = (page - 1) * limit;
    const today = new Date();

    const [events, totalCount] = await Promise.all([
      EventModel.find({ eventDate: { $gte: today } })
        .sort({ eventDate: -1 }) // Ordena pelo campo eventDate em ordem decrescente
        .skip(skip)
        .limit(limit)
        .lean(),
      EventModel.countDocuments({ eventDate: { $gte: today } }),
    ]);

    const totalPages = Math.ceil(totalCount / limit);

    return {
      items: events.map((event) => EventMongoDTO.fromMongo(event).toEntity()),
      totalPages,
      totalCount,
      prevPage: page > 1 ? page - 1 : null,
      nextPage: page < totalPages ? page + 1 : null,
    };
  }

  async getEventsByFilter(
    page: number,
    filter: any
  ): Promise<PaginationReturn<Event>> {
    const limit = 30;
    const skip = (page - 1) * limit;

    const [events, totalCount] = await Promise.all([
      EventModel.find(filter || {})
        .sort({ eventDate: -1 }) // Ordena pelo campo eventDate em ordem decrescente
        .skip(skip)
        .limit(limit)
        .lean(),
      EventModel.countDocuments(filter || {}),
    ]);

    console.log(events);

    const totalPages = Math.ceil(totalCount / limit);

    return {
      items: events.map((event) => EventMongoDTO.fromMongo(event).toEntity()),
      totalPages,
      totalCount,
      prevPage: page > 1 ? page - 1 : null,
      nextPage: page < totalPages ? page + 1 : null,
    };
  }

  async getEventsByIds(eventIds: string[]): Promise<Event[]> {
    const events = await EventModel.find({ _id: { $in: eventIds } }).lean();

    return events.map((event) => EventMongoDTO.fromMongo(event).toEntity());
  }

  async getEventById(eventId: string): Promise<Event | null> {
    const event = await EventModel.findById(eventId).lean();

    return event ? EventMongoDTO.fromMongo(event).toEntity() : null;
  }

  async updateEvent(
    eventId: string,
    updatedFields: Partial<Event>
  ): Promise<Event> {
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
      throw new NoItemsFound(
        `Evento com ID ${eventId} não encontrado para atualização.`
      );
    }

    return EventMongoDTO.fromMongo(result).toEntity();
  }
}
