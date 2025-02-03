import { Presence } from '../../../domain/entities/presence';
import { IPresenceRepository } from '../../../domain/repositories/presence_repository_interface';
import { PresenceModel } from '../models/presence.model';
import { PresenceMongoDTO } from '../dtos/presence_mongo_dto';
import { NoItemsFound } from '../../../../../src/shared/helpers/errors/errors';

export class PresenceRepositoryMongo implements IPresenceRepository {
  async createPresence(presence: Presence): Promise<Presence> {
    const presenceDoc = PresenceMongoDTO.fromEntity(presence).toMongo();
    const result = await PresenceModel.create(presenceDoc);

    return PresenceMongoDTO.fromMongo(result).toEntity();
  }

  async deletePresence(presenceId: string): Promise<void> {
    const result = await PresenceModel.deleteOne({ _id: presenceId });

    if (result.deletedCount === 0) {
      throw new NoItemsFound('Presença não encontrada');
    }
  }

  async getPresenceById(presenceId: string): Promise<Presence | null> {
    const result = await PresenceModel.findById(presenceId).lean();

    return result ? PresenceMongoDTO.fromMongo(result).toEntity() : null;
  }

  async getPresencesByIds(presencesIds: string[]): Promise<Presence[]> {
    const presenceDocs = await PresenceModel.find({
      _id: { $in: presencesIds },
    }).lean();

    return presenceDocs.map((doc) =>
      PresenceMongoDTO.fromMongo(doc).toEntity()
    );
  }

  async getPresencesByEvent(eventId: string): Promise<Presence[]> {
    const presenceDocs = await PresenceModel.find({ eventId }).lean();

    return presenceDocs.map((doc) =>
      PresenceMongoDTO.fromMongo(doc).toEntity()
    );
  }

  async getPresencesByUser(userId: string): Promise<Presence[]> {
    const presenceDocs = await PresenceModel.find({ userId }).lean();

    return presenceDocs.map((doc) =>
      PresenceMongoDTO.fromMongo(doc).toEntity()
    );
  }

  async getPresencesByEventAndUser(
    eventId: string,
    userId: string
  ): Promise<Presence | null> {
    const result = await PresenceModel.findOne({
      eventId,
      userId,
    }).lean();

    return result ? PresenceMongoDTO.fromMongo(result).toEntity() : null;
  }
}
