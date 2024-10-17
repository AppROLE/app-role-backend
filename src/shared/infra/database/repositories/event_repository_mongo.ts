import { IEvent } from "../models/event.model";
import { Event } from "../../../domain/entities/event";
import { EventMongoDTO } from "../dtos/event_mongo_dto";

import { connectDB } from "../models";
import { IEventRepository } from "../../../domain/irepositories/event_repository_interface";
import {
  ConflictItems,
  FailedToAddToGallery,
  NoItemsFound,
} from "../../../../../src/shared/helpers/errors/usecase_errors";
import { v4 as uuidv4 } from "uuid";
import { IPresence } from "../models/presence.model";

export class EventRepositoryMongo implements IEventRepository {
  async createEvent(event: Event): Promise<Event> {
    try {
      const db = await connectDB();
      db.connections[0].on("error", () => {
        console.error.bind(console, "connection error:");
        throw new Error("Error connecting to MongoDB");
      });

      const eventMongoClient =
        db.connections[0].db?.collection<IEvent>("Event");

      const dto = EventMongoDTO.fromEntity(event);
      const eventDoc = EventMongoDTO.toMongo(dto);

      eventDoc._id = uuidv4();

      const respMongo = await eventMongoClient?.insertOne(eventDoc);
      console.log("MONGO REPO EVENT RESPMONGO: ", respMongo);

      return event;
    } catch (error) {
      throw new Error(`Error creating event on MongoDB: ${error}`);
    }
  }

  async getAllEvents(): Promise<Event[]> {
    try {
      const db = await connectDB();
      db.connections[0].on("error", () => {
        console.error.bind(console, "connection error:");
        throw new Error("Error connecting to MongoDB");
      });

      const eventMongoClient =
        db.connections[0].db?.collection<IEvent>("Event");

      const events = (await eventMongoClient?.find().toArray()) as IEvent[];
      if (!events || events.length === 0) {
        throw new NoItemsFound("events");
      }

      return events.map((eventDoc) =>
        EventMongoDTO.toEntity(EventMongoDTO.fromMongo(eventDoc))
      );
    } catch (error) {
      throw new Error(`Error retrieving events from MongoDB: ${error}`);
    }
  }

  async getEventsByFilter(filter: any): Promise<Event[]> {
    try {
      const db = await connectDB();
      db.connections[0].on("error", () => {
        console.error.bind(console, "connection error:");
        throw new Error("Erro ao conectar ao MongoDB");
      });

      const eventMongoClient =
        db.connections[0].db?.collection<IEvent>("Event");

      const query: any = {};

      if (filter.name) {
        query.name = { $regex: new RegExp(filter.name, "i") };
      }
      if (filter.price) query.price = Number(filter.price);
      if (filter.age_range) query.age_range = filter.age_range;
      if (filter.event_date)
        query.event_date = { $gte: new Date(filter.event_date) };
      if (filter.district_id) query.district_id = filter.district_id;
      // if (filter.institute_id) query.institute_id = filter.institute_id;

      if (filter.music_type) {
        const musicTypes = filter.music_type.split(" ");
        query.music_type = { $in: musicTypes };
      }
      if (filter.features) {
        const features = filter.features.split(" ");
        query.features = { $in: features };
      }

      // if (filter.package_type) {
      //   const packageTypes = filter.package_type.split(" ");
      //   query.package_type = { $in: packageTypes };
      // }

      if (filter.category) {
        const category = filter.category.split(" ");
        query.category = { $in: category };
      }

      const eventDocs = (await eventMongoClient
        ?.find(query)
        .toArray()) as IEvent[];

      if (!eventDocs || eventDocs.length === 0) {
        throw new NoItemsFound("evento");
      }

      return eventDocs.map((eventDoc) =>
        EventMongoDTO.toEntity(EventMongoDTO.fromMongo(eventDoc))
      );
    } catch (error) {
      throw new Error(`Erro ao buscar eventos com filtro no MongoDB: ${error}`);
    }
  }

  async getEventById(eventId: string): Promise<Event> {
    try {
      const db = await connectDB();
      db.connections[0].on("error", () => {
        console.error.bind(console, "connection error:");
        throw new Error("Error connecting to MongoDB");
      });

      const eventMongoClient =
        db.connections[0].db?.collection<IEvent>("Event");

      const eventDoc = await eventMongoClient?.findOne({ _id: eventId });
      if (!eventDoc) {
        throw new NoItemsFound("evento");
      }
      console.log("eventDocAQUI: ", eventDoc);

      return EventMongoDTO.toEntity(EventMongoDTO.fromMongo(eventDoc));
    } catch (error) {
      if (error instanceof NoItemsFound) {
        throw new NoItemsFound("evento");
      }
      throw new Error(`Error retrieving event by ID from MongoDB: ${error}`);
    }
  }

  async deleteEventById(eventId: string): Promise<void> {
    try {
      const db = await connectDB();
      db.connections[0].on("error", () => {
        console.error.bind(console, "connection error:");
        throw new Error("Error connecting to MongoDB");
      });

      const eventMongoClient =
        db.connections[0].db?.collection<IEvent>("Event");

      const result = await eventMongoClient?.deleteOne({ _id: eventId });
      if (!result?.deletedCount) {
        throw new NoItemsFound("event");
      }
    } catch (error) {
      throw new Error(`Error deleting event from MongoDB: ${error}`);
    }
  }

  async updateEventPhoto(eventId: string, eventPhoto: string): Promise<string> {
    try {
      const db = await connectDB();
      db.connections[0].on("error", () => {
        console.error.bind(console, "connection error:");
        throw new Error("Error connecting to MongoDB");
      });

      const eventMongoClient =
        db.connections[0].db?.collection<IEvent>("Event");

      const result = await eventMongoClient?.updateOne(
        { _id: eventId },
        { $set: { event_photo_link: eventPhoto } }
      );

      if (!result?.modifiedCount) {
        throw new NoItemsFound("event");
      }

      return eventPhoto;
    } catch (error) {
      throw new Error(`Error updating event photo on MongoDB: ${error}`);
    }
  }

  async updateGalleryArray(eventId: string, imageKey: string): Promise<void> {
    try {
      const db = await connectDB();
      db.connections[0].on("error", () => {
        console.error.bind(console, "connection error:");
        throw new Error("Error connecting to MongoDB");
      });

      const eventMongoClient =
        db.connections[0].db?.collection<IEvent>("Event");

      const eventDoc = await eventMongoClient?.findOne({ _id: eventId });
      console.log("eventDocAQUI - UPDATE GALLERY: ", eventDoc);
      console.log("EVENT ID AQUI TMB PORRA", eventId);

      if (!eventDoc) {
        throw new NoItemsFound("event");
      }

      if (!eventDoc.galery_link) {
        await eventMongoClient?.updateOne(
          { _id: eventId },
          { $set: { galery_link: [] } }
        );
      }

      console.log(
        "TIPO DO GALERY",
        typeof eventDoc.galery_link,
        typeof eventDoc.galery_link
      );

      const result = await eventMongoClient?.updateOne(
        { _id: eventId },
        { $push: { galery_link: imageKey } }
      );

      if (!result?.modifiedCount) {
        throw new FailedToAddToGallery();
      }
    } catch (error) {
      throw new Error(`Error updating event gallery on MongoDB: ${error}`);
    }
  }

  async countGalleryEvent(eventId: string): Promise<Number> {
    try {
      const db = await connectDB();
      db.connections[0].on("error", () => {
        console.error.bind(console, "connection error:");
        throw new Error("Error connecting to MongoDB");
      });

      const eventMongoClient =
        db.connections[0].db?.collection<IEvent>("Event");

      const eventDocC = await eventMongoClient?.findOne({ _id: eventId });
      console.log("EVENT ID AQUI TMB AGORA NO COUNT", eventId);
      console.log("eventDocAQUI - COUNT: ", eventDocC);

      const eventDoc = await eventMongoClient?.findOne({ _id: eventId });
      if (!eventDoc) {
        throw new NoItemsFound("event");
      }

      return eventDoc.galery_link ? eventDoc.galery_link.length : 0;
    } catch (error) {
      throw new Error(`Error counting event gallery on MongoDB: ${error}`);
    }
  }

  async getEventsByUpcomingDates(dates: Date[]): Promise<Event[]> {
    try {
      console.log(
        "DADOS DAS DATAS: ",
        dates.map((date) => date.toISOString())
      );

      if (!dates || dates.length === 0) {
        throw new Error("Dates array is empty or undefined.");
      }

      const db = await connectDB();

      if (!db || !db.connections[0] || !db.connections[0].db) {
        throw new Error(
          "Failed to connect to MongoDB or retrieve the database."
        );
      }

      const eventMongoClient = db.connections[0].db.collection<IEvent>("Event");

      if (!eventMongoClient) {
        throw new Error("Failed to retrieve Event collection from MongoDB.");
      }

      const query = {
        $or: dates.map((date) => {
          const startOfDay = new Date(date);
          startOfDay.setUTCHours(0, 0, 0, 0);

          const endOfDay = new Date(date);
          endOfDay.setUTCHours(23, 59, 59, 999);

          return {
            event_date: {
              $gte: startOfDay,
              $lt: endOfDay,
            },
          };
        }),
      };

      console.log("QUERY AQUI: ", JSON.stringify(query, null, 2));

      const events = await eventMongoClient.find(query).toArray();

      console.log("EVENTOS AQUI VINDO DO REPO DO MONGOOOOO: ", events);

      if (!events || events.length === 0) {
        throw new Error("No events found for the provided dates.");
      }

      const mappedEvents = events.map((eventDoc) => {
        if (!eventDoc) {
          console.error("Documento de evento inválido:", eventDoc);
          throw new Error("Invalid event document from MongoDB.");
        }

        return EventMongoDTO.toEntity(EventMongoDTO.fromMongo(eventDoc));
      });

      return mappedEvents;
    } catch (error: any) {
      console.error("Error retrieving events by upcoming dates:", error);
      throw new Error(
        `Error retrieving events by upcoming dates: ${error.message}`
      );
    }
  }

  async createReview(
    star: number,
    review: string,
    reviewedAt: Date,
    eventId: string,
    name: string,
    photoUrl: string,
    username: string
  ): Promise<void> {
    try {
      const db = await connectDB();
      const eventMongoClient =
        db.connections[0].db?.collection<IEvent>("Event");

      const eventDoc = await eventMongoClient?.findOne({ _id: eventId });

      if (!eventDoc) {
        throw new NoItemsFound("event");
      }
      if (eventDoc.reviews.find((review) => review.username === username)) {
        throw new ConflictItems("event");
      }

      const reviewObj = {
        username,
        star,
        photoUrl,
        name,
        review,
        reviewedAt,
      };

      const result = await eventMongoClient?.updateOne(
        { _id: eventId },
        { $push: { reviews: reviewObj } }
      );

      if (!result?.modifiedCount) {
        throw new Error("Error adding review to event");
      }
    } catch (error: any) {
      if (error instanceof NoItemsFound) {
        throw new NoItemsFound("event");
      }
      if (error instanceof ConflictItems) {
        throw new ConflictItems("event");
      }
      throw new Error(`Error retrieving events by upcoming dates: ${error}`);
    }
  }

  async getAllConfirmedEvents(username: string): Promise<Event[]> {
    try {
      const db = await connectDB();
      const presenceMongoClient =
        db.connections[0].db?.collection<IPresence>("Presence");
      const eventMongoClient =
        db.connections[0].db?.collection<IEvent>("Event");

      const presences = await presenceMongoClient?.find({ username }).toArray();

      if (!presences || presences.length === 0) {
        throw new NoItemsFound("event");
      }

      const eventIds = presences.map((presence) => presence.event_id);

      const events = await eventMongoClient
        ?.find({ _id: { $in: eventIds } })
        .toArray();

      if (!events || events.length === 0) {
        throw new NoItemsFound("event");
      }

      return events.map((eventDoc) =>
        EventMongoDTO.toEntity(EventMongoDTO.fromMongo(eventDoc))
      );
    } catch (error: any) {
      if(error instanceof NoItemsFound) {
        throw new NoItemsFound("event");
      }
      throw new Error(`Error retrieving all confirmed events: ${error}`);
    }
  }
}
