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
import { IUser } from "../models/user.model";

export class EventRepositoryMongo implements IEventRepository {

  async updateEventBanner(eventId: string, bannerUrl: string): Promise<void> {
    try {
      console.log("Conectando ao MongoDB para atualizar o banner do evento...");
      const db = await connectDB();
      const eventMongoClient = db.connections[0].db?.collection<IEvent>("Event");
  
      console.log(`Buscando evento com ID: ${eventId}`);
      const eventDoc = await eventMongoClient?.findOne({ _id: eventId });
  
      if (!eventDoc) {
        console.error("Evento não encontrado no MongoDB.");
        throw new NoItemsFound("event");
      }
  
      console.log("Link atual do banner:", eventDoc.banner_url);
      console.log("Novo link do banner:", bannerUrl);
  
      if (eventDoc.banner_url === bannerUrl) {
        console.log("O link do banner fornecido é idêntico ao atual. Nenhuma atualização necessária.");
        return;
      }
  
      const result = await eventMongoClient?.updateOne(
        { _id: eventId },
        { $set: { banner_url: bannerUrl } }
      );
  
      if (result?.modifiedCount === 0) {
        console.log("Nenhuma modificação detectada no documento do evento.");
        throw new Error("Erro ao atualizar o banner do evento, nenhuma modificação detectada.");
      }
  
      console.log("Banner do evento atualizado com sucesso no MongoDB.");
    } catch (error: any) {
      console.error("Erro ao atualizar o banner do evento no MongoDB:", error.message);
      throw new Error(`Erro ao atualizar o banner do evento no MongoDB: ${error.message}`);
    }
  }
  
  

  async createEvent(event: Event): Promise<string> {
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

      if (!respMongo) {
        throw new Error("Failed to insert event into MongoDB");
      }
      return respMongo.insertedId;
      
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

  async getAllEventsFromToday(page: number): Promise<Event[]> {
    try {
      const db = await connectDB();
      db.connections[0].on("error", () => {
        console.error("connection error:");
        throw new Error("Error connecting to MongoDB");
      });
  
      const eventMongoClient = db.connections[0].db?.collection<IEvent>("Event");
  
      const today = new Date();
      today.setUTCHours(0, 0, 0, 0);
  
      const limit = 100 * page; 
  
      const events = (await eventMongoClient
        ?.find({ event_date: { $gte: today } })
        .sort({ event_date: 1 }) 
        .limit(limit) 
        .toArray()) as IEvent[];
  
      if (!events || events.length === 0) {
        throw new NoItemsFound("events");
      }
  
      return events.map((eventDoc) =>
        EventMongoDTO.toEntity(EventMongoDTO.fromMongo(eventDoc))
      );
    } catch (error: any) {
      throw new Error(`Error retrieving events from MongoDB: ${error.message}`);
    }
  }
  
  

  async getEventsByFilter(filter: any): Promise<Event[]> {
    try {
      const db = await connectDB();
      db.connections[0].on("error", () => {
        console.error("Erro de conexão com o MongoDB");
        throw new Error("Erro ao conectar ao MongoDB");
      });

      const eventMongoClient =
        db.connections[0].db?.collection<IEvent>("Event");

      // Construção do filtro de consulta
      const query: any = {};

      if (filter.name) {
        query.name = { $regex: new RegExp(filter.name, "i") };
      }
      if (filter.price) query.price = Number(filter.price);
      if (filter.age_range) query.age_range = filter.age_range;

      if (filter.event_date) {
        const startOfDay = new Date(filter.event_date);
        startOfDay.setUTCHours(0, 0, 0, 0);

        const endOfDay = new Date(filter.event_date);
        endOfDay.setUTCHours(23, 59, 59, 999);

        query.event_date = {
          $gte: startOfDay,
          $lte: endOfDay,
        };
      } else {
        const today = new Date();
        today.setUTCHours(0, 0, 0, 0);
        query.event_date = { $gte: today };
      }

      if (filter.district_id) query.district_id = filter.district_id;

      if (filter.instituteId && typeof filter.instituteId === "string") {
        query.institute_id = filter.instituteId;
      }

      if (filter.music_type) {
        const musicTypes = filter.music_type.split(" ");
        query.music_type = { $in: musicTypes };
      }
      if (filter.features) {
        const features = filter.features.split(" ");
        query.features = { $in: features };
      }
      if (filter.category) {
        const category = filter.category.split(" ");
        query.category = { $in: category };
      }

      console.log("Consulta final:", query); 

      const eventDocs = await eventMongoClient
        ?.find(query)
        .sort({ event_date: 1 })
        .toArray();

      console.log("Eventos encontrados:", eventDocs); 

      if (!eventDocs || eventDocs.length === 0) {
        return [];
      }

      return eventDocs.map((eventDoc) =>
        EventMongoDTO.toEntity(EventMongoDTO.fromMongo(eventDoc))
      );
    } catch (error) {
      throw new Error(`Erro ao buscar eventos com filtro no MongoDB: ${error}`);
    }
  }

  async getEventById(eventId: string): Promise<Event | undefined> {
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
        return undefined;
      }
      console.log("eventDocAQUI: ", eventDoc);

      return EventMongoDTO.toEntity(EventMongoDTO.fromMongo(eventDoc));
    } catch (error) {
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

      const event = await eventMongoClient?.findOne({ _id: eventId });
      if (!event) {
        throw new NoItemsFound("event");
      }

      const result = await eventMongoClient?.updateOne(
        { _id: eventId },
        { $set: { event_photo_link: eventPhoto } }
      );

      if (!result?.modifiedCount) {
        throw new Error(
          "Error updating event photo, no modifications detected."
        );
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
        console.warn("No events found for the provided dates.");
        return [];
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

  async getAllConfirmedEvents(
    username: string,
    isMyEvents: boolean,
    myUsername: string
  ): Promise<Event[]> {
    try {
      const db = await connectDB();
      const presenceMongoClient =
        db.connections[0].db?.collection<IPresence>("Presence");
      const eventMongoClient =
        db.connections[0].db?.collection<IEvent>("Event");
      const userMongoClient = db.connections[0].db?.collection<IUser>("User");

      const user = await userMongoClient?.findOne({ username });
      const myUser = await userMongoClient?.findOne({ username: myUsername });

      let isFriends = false;
      if (user?.following) {
        user?.following.forEach((following) => {
          if (following.user_followed_id === myUser?._id) {
            isFriends = true;
          }
        });
      }

      if (user?.privacy === "PRIVATE" && !isMyEvents && !isFriends) {
        return [];
      }

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
      if (error instanceof NoItemsFound) {
        throw new NoItemsFound("event");
      }
      throw new Error(`Error retrieving all confirmed events: ${error}`);
    }
  }

  async updateEvent(
    eventId: string,
    updatedFields: Partial<IEvent>
  ): Promise<Event> {
    try {
      const db = await connectDB();
      db.connections[0].on("error", () => {
        console.error.bind(console, "connection error:");
        throw new Error("Error connecting to MongoDB");
      });

      const eventMongoClient =
        db.connections[0].db?.collection<IEvent>("Event");

      const updatedEvent = await eventMongoClient?.findOneAndUpdate(
        { _id: eventId },
        { $set: updatedFields },
        { returnDocument: "after" }
      );

      if (!updatedEvent) {
        throw new Error(`Event with ID ${eventId} not found`);
      }

      return EventMongoDTO.toEntity(EventMongoDTO.fromMongo(updatedEvent));
    } catch (error) {
      throw new Error(`Error updating event in MongoDB: ${error}`);
    }
  }
}
