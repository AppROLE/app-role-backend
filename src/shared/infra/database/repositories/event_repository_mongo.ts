import { Event } from "../../../domain/entities/event";
import { IEventRepository } from "../../../domain/repositories/event_repository_interface";
import { IEvent } from "../models/event.model";
import { EventMongoDTO } from "../dtos/event_mongo_dto";
import {
  NoItemsFound,
  ConflictItems,
  FailedToAddToGallery,
} from "../../../../../src/shared/helpers/errors/usecase_errors";
import { Collection, Connection } from "mongoose";

export class EventRepositoryMongo implements IEventRepository {
  private eventCollection: Collection<IEvent>;

  constructor(connection: Connection) {
    this.eventCollection = connection.collection<IEvent>("Event");
  }

  getEventsByUpcomingDates(dates: Date[]): Promise<Event[]> {
    throw new Error("Method not implemented.");
  }

  createReview(
    star: number,
    review: string,
    reviewedAt: Date,
    eventId: string,
    name: string,
    photoUrl: string,
    username: string
  ): Promise<void> {
    throw new Error("Method not implemented.");
  }
  getAllConfirmedEvents(
    username: string,
    isMyEvents: boolean,
    myUsername: string
  ): Promise<Event[]> {
    throw new Error("Method not implemented.");
  }

  async createEvent(event: Event): Promise<string> {
    const dto = EventMongoDTO.fromEntity(event);
    const eventDoc = EventMongoDTO.toMongo(dto);

    const result = await this.eventCollection.insertOne(eventDoc);
    if (!result.acknowledged) {
      throw new Error("Failed to create event in MongoDB.");
    }

    return result.insertedId.toString();
  }

  async getEventById(eventId: string): Promise<Event | undefined> {
    const eventDoc = await this.eventCollection.findOne({ _id: eventId });

    if (!eventDoc) {
      throw new NoItemsFound("event");
    }

    const eventDto = EventMongoDTO.fromMongo(eventDoc);
    return EventMongoDTO.toEntity(eventDto);
  }

  async getAllEvents(): Promise<Event[]> {
    const eventDocs = await this.eventCollection.find().toArray();

    if (!eventDocs || eventDocs.length === 0) {
      throw new NoItemsFound("events");
    }

    return eventDocs.map((eventDoc) =>
      EventMongoDTO.toEntity(EventMongoDTO.fromMongo(eventDoc))
    );
  }

  async updateEvent(
    eventId: string,
    updatedFields: Partial<IEvent>
  ): Promise<Event> {
    const updatedEvent = await this.eventCollection.findOneAndUpdate(
      { _id: eventId },
      { $set: updatedFields },
      { returnDocument: "after" }
    );

    if (!updatedEvent) {
      throw new Error(`Event with ID ${eventId} not found`);
    }

    return EventMongoDTO.toEntity(EventMongoDTO.fromMongo(updatedEvent));
  }

  async deleteEventById(eventId: string): Promise<void> {
    const result = await this.eventCollection.deleteOne({ _id: eventId });
    if (!result.deletedCount) {
      throw new NoItemsFound("event");
    }
  }

  async updateEventBanner(eventId: string, bannerUrl: string): Promise<void> {
    const eventDoc = await this.eventCollection.findOne({ _id: eventId });

    if (!eventDoc) {
      throw new NoItemsFound("event");
    }

    if (eventDoc.banner_url === bannerUrl) {
      return;
    }

    const result = await this.eventCollection.updateOne(
      { _id: eventId },
      { $set: { banner_url: bannerUrl } }
    );

    if (result.modifiedCount === 0) {
      throw new Error("Failed to update event banner.");
    }
  }

  async updateEventPhoto(eventId: string, eventPhoto: string): Promise<string> {
    const result = await this.eventCollection.updateOne(
      { _id: eventId },
      { $set: { event_photo_link: eventPhoto } }
    );

    if (!result.modifiedCount) {
      throw new Error("Failed to update event photo.");
    }

    return eventPhoto;
  }

  async updateGalleryArray(eventId: string, imageKey: string): Promise<void> {
    const result = await this.eventCollection.updateOne(
      { _id: eventId },
      { $push: { galery_link: imageKey } }
    );

    if (!result.modifiedCount) {
      throw new FailedToAddToGallery();
    }
  }

  async countGalleryEvent(eventId: string): Promise<number> {
    const eventDoc = await this.eventCollection.findOne({ _id: eventId });

    if (!eventDoc) {
      throw new NoItemsFound("event");
    }

    return eventDoc.galery_link ? eventDoc.galery_link.length : 0;
  }

  async getEventsByFilter(filter: any): Promise<Event[]> {
    const query: { [key: string]: any } = {};

    if (filter.name) {
      query.name = { $regex: new RegExp(filter.name, "i") };
    }
    if (filter.event_date) {
      query.event_date = { $gte: new Date(filter.event_date) };
    }

    const eventDocs = await this.eventCollection.find(query).toArray();
    if (!eventDocs.length) {
      return [];
    }

    return eventDocs.map((eventDoc) =>
      EventMongoDTO.toEntity(EventMongoDTO.fromMongo(eventDoc))
    );
  }

  async getAllEventsFromToday(page: number): Promise<Event[]> {
    const today = new Date();
    today.setUTCHours(0, 0, 0, 0);
    const limit = 20 * page;

    const eventDocs = await this.eventCollection
      .find({ event_date: { $gte: today } })
      .sort({ event_date: 1 })
      .limit(limit)
      .toArray();

    if (!eventDocs.length) {
      throw new NoItemsFound("events");
    }

    return eventDocs.map((eventDoc) =>
      EventMongoDTO.toEntity(EventMongoDTO.fromMongo(eventDoc))
    );
  }
}
