import { DuplicatedItem, NoItemsFound } from 'src/shared/helpers/errors/errors';
import { ProfileMongoDTO } from '../dtos/profile_mongo_dto';
import { ProfileModel } from '../models/profile.model';
import { IProfileRepository } from 'src/shared/domain/repositories/profile_repository_interface';
import { Profile } from 'src/shared/domain/entities/profile';
import { ProfileCardReturn } from 'src/shared/helpers/types/profile_card_return';
import { PaginationReturn } from 'src/shared/helpers/types/event_pagination';
import { EventCardReturn } from 'src/shared/helpers/types/event_card_return';
import { PresenceModel } from '../models/presence.model';
import { EventModel } from '../models/event.model';
import { ReviewModel } from '../models/review.model';
import { InstituteModel } from '../models/institute.model';
import { AuditModel } from '../models/audit_log.model';
import mongoose, { Types } from 'mongoose';

export class ProfileRepositoryMongo implements IProfileRepository {
  async getByEmail(email: string): Promise<Profile | null> {
    const userDoc = await ProfileModel.findOne({ email }).lean();
    return userDoc ? ProfileMongoDTO.fromMongo(userDoc).toEntity() : null;
  }

  async getByUsername(username: string): Promise<Profile | null> {
    const userDoc = await ProfileModel.findOne({ username }).lean();
    return userDoc ? ProfileMongoDTO.fromMongo(userDoc).toEntity() : null;
  }

  async getByUserId(userId: string): Promise<Profile | null> {
    console.log('🔍 Buscando usuário com ID:', userId);

    const query = Types.ObjectId.isValid(userId)
      ? { _id: new Types.ObjectId(userId) }
      : { _id: userId };

    const userDoc = await ProfileModel.findOne(query).lean();

    console.log('🔎 Resultado da busca:', userDoc);

    return userDoc ? ProfileMongoDTO.fromMongo(userDoc).toEntity() : null;
  }

  // async getByUserId(userId: string): Promise<Profile | null> {
  //   const userDoc = await ProfileModel.findOne({ _id: userId }).lean();
  //   console.log('userDoc AQUI NO REPO', userDoc);
  //   return userDoc ? ProfileMongoDTO.fromMongo(userDoc).toEntity() : null;
  // }

  async getAllProfilesPagination(
    page: number,
    profilesId: string[]
  ): Promise<PaginationReturn<Profile>> {
    const limit = 30;
    const skip = (page - 1) * limit;

    const paginatedIds = profilesId.slice(skip, skip + limit);

    const profiles = await ProfileModel.find({
      _id: { $in: paginatedIds },
    }).lean();

    const totalPages = Math.ceil(profilesId.length / limit);

    return {
      items: profiles.map((profileDoc) =>
        ProfileMongoDTO.fromMongo(profileDoc).toEntity()
      ),
      totalPages,
      totalCount: profilesId.length,
      prevPage: page > 1 ? page - 1 : null,
      nextPage: page < totalPages ? page + 1 : null,
    };
  }

  async createProfile(profile: Profile): Promise<Profile> {
    const profileDoc = ProfileMongoDTO.fromEntity(profile).toMongo();
    const result = await ProfileModel.create(profileDoc);
    return ProfileMongoDTO.fromMongo(result).toEntity();
  }

  async deleteProfile(userId: string): Promise<void> {
    const presences = await PresenceModel.find({ userId });
    const presenceIds = presences.map((presence) => presence._id);

    await PresenceModel.deleteMany({ userId });

    const eventIds = presences.map((presence) => presence.eventId);
    await EventModel.updateMany(
      { _id: { $in: eventIds } },
      { $pull: { presencesId: { $in: presenceIds } } }
    );

    const reviews = await ReviewModel.find({ userId });
    const reviewIds = reviews.map((review) => review._id);

    await ReviewModel.deleteMany({ userId });

    const instituteIds = reviews.map((review) => review.instituteId);
    await InstituteModel.updateMany(
      { _id: { $in: instituteIds } },
      { $pull: { reviewsId: { $in: reviewIds } } }
    );

    await ProfileModel.deleteOne({ _id: userId });

    await AuditModel.create({
      action: 'deleteProfile',
      entity: 'Profile',
      entityId: userId,
      performedBy: userId, // ID do usuário que solicitou a ação
      details: {
        message: 'Perfil do usuário e dados relacionados foram excluídos.',
        affectedEntities: {
          presencesDeleted: presenceIds.length,
          reviewsDeleted: reviewIds.length,
          eventsUpdated: eventIds.length,
          institutesUpdated: instituteIds.length,
        },
      },
      timestamp: new Date(),
      status: 'SUCCESS',
    });
  }

  async findProfile(
    searchTerm: string,
    myUserId: string,
    page: number
  ): Promise<PaginationReturn<ProfileCardReturn>> {
    const limit = 10;
    const skip = (page - 1) * limit;

    const profiles = await ProfileModel.aggregate([
      {
        $match: {
          $and: [
            { username: { $regex: `^${searchTerm}`, $options: 'i' } },
            { _id: { $ne: myUserId } }, // Exclui o próprio usuário
          ],
        },
      },
      {
        $addFields: {
          isFriend: {
            $and: [
              { $in: [myUserId, '$followers'] },
              { $in: [myUserId, '$following'] },
            ],
          },
        },
      },
      { $sort: { isFriend: -1, username: 1 } }, // Ordenar amigos primeiro e, depois, por username
      { $skip: skip },
      { $limit: limit },
      {
        $project: {
          userId: '$_id',
          nickname: 1,
          username: 1,
          profilePhoto: 1,
          isFriend: 1,
        },
      },
    ]);

    const totalCount = await ProfileModel.countDocuments({
      username: { $regex: `^${searchTerm}`, $options: 'i' },
      _id: { $ne: myUserId },
    });

    const totalPages = Math.ceil(totalCount / limit);

    return {
      items: profiles,
      totalPages,
      totalCount,
      prevPage: page > 1 ? page - 1 : null,
      nextPage: page < totalPages ? page + 1 : null,
    };
  }

  async updateProfile(
    userId: string,
    updateFields: Partial<Profile>
  ): Promise<Profile> {
    const sanitizedFields = Object.fromEntries(
      Object.entries(updateFields).filter(([_, value]) => value != null)
    );

    sanitizedFields.updatedAt = new Date() as any;

    const result = await ProfileModel.findByIdAndUpdate(
      userId,
      { $set: sanitizedFields },
      { new: true }
    ).lean();
    if (!result) {
      throw new NoItemsFound('Perfil não atualizado.');
    }

    return ProfileMongoDTO.fromMongo(result).toEntity();
  }

  async addFavoriteInstitute(
    userId: string,
    instituteId: string
  ): Promise<void> {
    const result = await ProfileModel.updateOne(
      { _id: userId },
      { $addToSet: { favorites: instituteId } }
    );

    if (!result.modifiedCount) {
      throw new Error('Erro ao adicionar instituto favorito.');
    }
  }

  async removeFavoriteInstitute(
    userId: string,
    instituteId: string
  ): Promise<void> {
    const result = await ProfileModel.updateOne(
      { _id: userId },
      { $pull: { favorites: instituteId } }
    );

    if (!result.modifiedCount) {
      throw new Error('Erro ao remover instituto favorito.');
    }
  }

  async removeAllFavoriteInstitute(userId: string): Promise<void> {
    const result = await ProfileModel.updateOne(
      { _id: userId },
      { $set: { favorites: [] } }
    );

    if (!result.modifiedCount) {
      throw new Error('Erro ao remover todos os institutos favoritos.');
    }
  }

  async getConfirmedPresencesEventCardsForProfile(
    userId: string,
    page: number
  ): Promise<PaginationReturn<EventCardReturn>> {
    const limit = 30;
    const skip = (page - 1) * limit;
    const today = new Date();

    const aggregateResult = await PresenceModel.aggregate([
      { $match: { userId } },
      {
        $lookup: {
          from: 'events',
          localField: 'eventId',
          foreignField: '_id',
          as: 'event',
        },
      },
      { $unwind: { path: '$event', preserveNullAndEmptyArrays: false } },
      { $match: { 'event.eventDate': { $gt: today } } },
      {
        $lookup: {
          from: 'institutes',
          localField: 'event.instituteId',
          foreignField: '_id',
          as: 'institute',
        },
      },
      { $unwind: { path: '$institute', preserveNullAndEmptyArrays: false } },
      {
        $project: {
          eventId: '$event._id',
          presenceId: '$_id',
          eventName: '$event.name',
          eventDate: '$event.eventDate',
          instituteName: '$institute.name',
          instituteRating: '$institute.rating',
          address: '$event.address',
          photo: '$event.eventPhoto',
        },
      },
      { $sort: { eventDate: -1 } },
      { $skip: skip },
      { $limit: limit },
    ]);

    const totalCount = await PresenceModel.aggregate([
      { $match: { userId } },
      {
        $lookup: {
          from: 'events',
          localField: 'eventId',
          foreignField: '_id',
          as: 'event',
        },
      },
      { $unwind: { path: '$event', preserveNullAndEmptyArrays: false } },
      { $match: { 'event.eventDate': { $gt: today } } },
      { $count: 'total' },
    ]).then((res) => (res.length > 0 ? res[0].total : 0));

    const totalPages = Math.ceil(totalCount / limit);

    return {
      items: aggregateResult,
      totalPages,
      totalCount,
      prevPage: page > 1 ? page - 1 : null,
      nextPage: page < totalPages ? page + 1 : null,
    };
  }

  async getHistoricPresencesEventCardsForProfile(
    userId: string,
    page: number
  ): Promise<PaginationReturn<EventCardReturn>> {
    const limit = 30;
    const skip = (page - 1) * limit;
    const today = new Date();

    const aggregateResult = await PresenceModel.aggregate([
      { $match: { userId } },
      {
        $lookup: {
          from: 'events',
          localField: 'eventId',
          foreignField: '_id',
          as: 'event',
        },
      },
      { $unwind: { path: '$event', preserveNullAndEmptyArrays: false } },
      { $match: { 'event.eventDate': { $lt: today } } },
      {
        $lookup: {
          from: 'institutes',
          localField: 'event.instituteId',
          foreignField: '_id',
          as: 'institute',
        },
      },
      { $unwind: { path: '$institute', preserveNullAndEmptyArrays: false } },
      {
        $project: {
          eventId: '$event._id',
          presenceId: '$_id',
          eventName: '$event.name',
          eventDate: '$event.eventDate',
          instituteName: '$institute.name',
          instituteRating: '$institute.rating',
          address: '$event.address',
          photo: '$event.eventPhoto',
        },
      },
      { $sort: { eventDate: -1 } },
      { $skip: skip },
      { $limit: limit },
    ]);

    // Contar o total de presenças históricas
    const totalCount = await PresenceModel.aggregate([
      { $match: { userId } },
      {
        $lookup: {
          from: 'events',
          localField: 'eventId',
          foreignField: '_id',
          as: 'event',
        },
      },
      { $unwind: { path: '$event', preserveNullAndEmptyArrays: false } },
      { $match: { 'event.eventDate': { $lt: today } } },
      { $count: 'total' },
    ]).then((res) => (res.length > 0 ? res[0].total : 0));

    const totalPages = Math.ceil(totalCount / limit);

    return {
      items: aggregateResult,
      totalPages,
      totalCount,
      prevPage: page > 1 ? page - 1 : null,
      nextPage: page < totalPages ? page + 1 : null,
    };
  }

  async getProfilesWithFriendshipPriority(
    profileIds: string[],
    myUserId: string,
    page: number
  ): Promise<PaginationReturn<ProfileCardReturn>> {
    const limit = 30;
    const skip = (page - 1) * limit;

    // Agregação para buscar perfis e avaliar amizade
    const aggregateResult = await ProfileModel.aggregate([
      { $match: { _id: { $in: profileIds } } },
      {
        $addFields: {
          isFriend: {
            $and: [
              { $in: [myUserId, '$followers'] },
              { $in: [myUserId, '$following'] },
            ],
          },
        },
      },
      { $sort: { isFriend: -1, name: 1 } }, // Ordenar amigos primeiro, depois pelo nome
      { $skip: skip },
      { $limit: limit },
      {
        $project: {
          userId: '$_id',
          nickname: 1,
          username: 1,
          profilePhoto: 1,
          isFriend: 1, // Retornar o status de amizade no resultado
        },
      },
    ]);

    // Calcular total de perfis
    const totalCount = profileIds.length;
    const totalPages = Math.ceil(totalCount / limit);

    return {
      items: aggregateResult,
      totalPages,
      totalCount,
      prevPage: page > 1 ? page - 1 : null,
      nextPage: page < totalPages ? page + 1 : null,
    };
  }

  async followProfile(myUserId: string, userId: string): Promise<void> {
    await ProfileModel.updateOne(
      { _id: myUserId },
      { $addToSet: { following: userId } }
    );

    await ProfileModel.updateOne(
      { _id: userId },
      { $addToSet: { followers: myUserId } }
    );
  }

  async unfollowProfile(myUserId: string, userId: string): Promise<void> {
    await ProfileModel.updateOne(
      { _id: myUserId },
      { $pull: { following: userId } }
    );

    await ProfileModel.updateOne(
      { _id: userId },
      { $pull: { followers: myUserId } }
    );
  }
}
