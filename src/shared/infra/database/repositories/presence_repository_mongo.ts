import { Presence } from "../../../domain/entities/presence";
import { IPresenceRepository } from "../../../domain/repositories/presence_repository_interface";
import { IPresence } from "../models/presence.model";
import { PresenceMongoDTO } from "../dtos/presence_mongo_dto";
import { NoItemsFound } from "../../../../../src/shared/helpers/errors/errors";
import { Collection, Connection } from "mongoose";

export class PresenceRepositoryMongo implements IPresenceRepository {
  private presenceCollection: Collection<IPresence>;

  constructor(connection: Connection) {
    this.presenceCollection = connection.collection<IPresence>("Presence");
  }

  async createPresence(presence: Presence): Promise<Presence> {
    const presenceDoc = PresenceMongoDTO.fromEntity(presence).toMongo();

    const result = await this.presenceCollection.insertOne(presenceDoc);

    if (!result.acknowledged) {
      throw new Error("Failed to create presence in MongoDB.");
    }

    const createdPresenceDoc = await this.presenceCollection.findOne({
      _id: presenceDoc._id,
    });

    if (!createdPresenceDoc) {
      throw new Error("Failed to find created presence in MongoDB.");
    }

    return PresenceMongoDTO.fromMongo(createdPresenceDoc).toEntity();
  }

  async deletePresence(eventId: string, userId: string): Promise<void> {
    const result = await this.presenceCollection.deleteOne({
      event_id: eventId,
      username: userId,
    });

    if (!result.deletedCount) {
      throw new NoItemsFound("presence");
    }
  }

  async getPresencesByEvent(eventId: string): Promise<Presence[]> {
    const presenceDocs = await this.presenceCollection
      .find({ event_id: eventId })
      .toArray();

    if (!presenceDocs || presenceDocs.length === 0) {
      return [];
    }

    return presenceDocs.map((presenceDoc) =>
      PresenceMongoDTO.fromMongo(presenceDoc).toEntity()
    );
  }

  async getPresencesByUser(userId: string): Promise<Presence[]> {
    const presenceDocs = await this.presenceCollection
      .find({ username: userId })
      .toArray();

    if (!presenceDocs || presenceDocs.length === 0) {
      return [];
    }

    return presenceDocs.map((presenceDoc) =>
      PresenceMongoDTO.fromMongo(presenceDoc).toEntity()
    );
  }

  async getPresencesByEventAndUser(
    eventId: string,
    userId: string
  ): Promise<Presence[]> {
    const presenceDocs = await this.presenceCollection
      .find({ event_id: eventId, username: userId })
      .toArray();

    if (!presenceDocs || presenceDocs.length === 0) {
      return [];
    }

    return presenceDocs.map((presenceDoc) =>
      PresenceMongoDTO.fromMongo(presenceDoc).toEntity()
    );
  }
}
