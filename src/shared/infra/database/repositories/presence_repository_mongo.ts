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

  async getAllPresences(eventId: string): Promise<Presence[]> {
    const presenceDocs = await this.presenceCollection
      .find({ event_id: eventId })
      .toArray();

    if (!presenceDocs || presenceDocs.length === 0) {
      return [];
    }

    return presenceDocs.map((doc) =>
      PresenceMongoDTO.toEntity(PresenceMongoDTO.fromMongo(doc))
    );
  }

  async confirmPresence(
    eventId: string,
    username: string,
    nickname: string,
    profilePhoto?: string,
    promoterCode?: string
  ): Promise<void> {
    const presence = new Presence({
      eventId,
      username,
      nickname,
      profilePhoto,
      promoterCode,
      checkedInAt: new Date(),
    });

    const dto = PresenceMongoDTO.fromEntity(presence);
    const presenceDoc = PresenceMongoDTO.toMongo(dto);

    const result = await this.presenceCollection.insertOne(presenceDoc);
    if (!result.acknowledged) {
      throw new Error("Failed to confirm presence in MongoDB.");
    }
  }

  async countPresencesByEvent(
    eventIds: string[]
  ): Promise<{ eventId: string; count: number }[]> {
    const counts = await Promise.all(
      eventIds.map(async (eventId) => {
        const count = await this.presenceCollection.countDocuments({
          event_id: eventId,
        });
        return { eventId, count };
      })
    );

    return counts;
  }

  async getPresenceByEventAndUser(
    eventId: string,
    username: string
  ): Promise<Presence | null> {
    const presenceDoc = await this.presenceCollection.findOne({
      event_id: eventId,
      username,
    });

    if (!presenceDoc) {
      return null;
    }

    return PresenceMongoDTO.toEntity(PresenceMongoDTO.fromMongo(presenceDoc));
  }

  async unConfirmPresence(eventId: string, username: string): Promise<void> {
    const result = await this.presenceCollection.deleteOne({
      event_id: eventId,
      username,
    });
    if (!result.deletedCount) {
      throw new NoItemsFound("presence");
    }
  }
}
