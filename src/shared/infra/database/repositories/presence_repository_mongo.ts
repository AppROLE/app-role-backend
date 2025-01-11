import { Presence } from '../../../domain/entities/presence';
import { IPresenceRepository } from '../../../domain/repositories/presence_repository_interface';
import { IPresence } from '../models/presence.model';
import { PresenceMongoDTO } from '../dtos/presence_mongo_dto';
import { NoItemsFound } from '../../../../../src/shared/helpers/errors/errors';
import { Collection, Connection } from 'mongoose';

export class PresenceRepositoryMongo implements IPresenceRepository {
  private presenceCollection: Collection<IPresence>;

  constructor(connection: Connection) {
    this.presenceCollection = connection.collection<IPresence>('presences');
  }

  async createPresence(presence: Presence): Promise<Presence> {
    const presenceDoc = PresenceMongoDTO.fromEntity(presence).toMongo();

    const result = await this.presenceCollection.insertOne(presenceDoc);

    if (!result.acknowledged) {
      throw new Error('Failed to create presence in MongoDB.');
    }

    const createdPresenceDoc = await this.presenceCollection.findOne({
      _id: presenceDoc._id,
    });

    if (!createdPresenceDoc) {
      throw new Error('Failed to find created presence in MongoDB.');
    }

    return PresenceMongoDTO.fromMongo(createdPresenceDoc).toEntity();
  }

  async deletePresence(presenceId: string): Promise<void> {
    const result = await this.presenceCollection.deleteOne({ _id: presenceId });

    if (!result.deletedCount || result.deletedCount === 0) {
      throw new NoItemsFound('Presença não encontrada');
    }
  }

  async getPresenceById(presenceId: string): Promise<Presence | null> {
    const result = await this.presenceCollection.findOne({ _id: presenceId });

    if (!result) {
      return null;
    }

    return PresenceMongoDTO.fromMongo(result).toEntity();
  }

  async getPresencesByIds(presencesIds: string[]): Promise<Presence[]> {
    const presenceDocs = await this.presenceCollection
      .find({ _id: { $in: presencesIds } })
      .toArray();

    if (!presenceDocs || presenceDocs.length === 0) {
      return [];
    }

    return presenceDocs.map((presenceDoc) =>
      PresenceMongoDTO.fromMongo(presenceDoc).toEntity()
    );
  }

  async getPresencesByEvent(eventId: string): Promise<Presence[]> {
    const presenceDocs = await this.presenceCollection
      .find({ eventId: eventId })
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
  ): Promise<Presence | null> {
    const presenceDocs = await this.presenceCollection.findOne({
      eventId: eventId,
      username: userId,
    });

    if (!presenceDocs) {
      return null;
    }

    return PresenceMongoDTO.fromMongo(presenceDocs).toEntity();
  }
}
