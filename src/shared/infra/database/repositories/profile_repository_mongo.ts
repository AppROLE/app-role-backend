import { DuplicatedItem, NoItemsFound } from 'src/shared/helpers/errors/errors';
import { ProfileMongoDTO } from '../dtos/profile_mongo_dto';
import { ProfileModel } from '../models/profile.model';
import { IProfileRepository } from 'src/shared/domain/repositories/profile_repository_interface';
import { Profile } from 'src/shared/domain/entities/profile';
import { FindPersonReturn } from 'src/shared/helpers/types/find_person_return_type';
import { PaginationReturn } from 'src/shared/helpers/types/event_pagination';

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
    const userDoc = await ProfileModel.findById(userId).lean();
    return userDoc ? ProfileMongoDTO.fromMongo(userDoc).toEntity() : null;
  }

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
    const result = await ProfileModel.deleteOne({ _id: userId });
    if (result.deletedCount === 0) {
      throw new Error(`Usuário com ID ${userId} não encontrado.`);
    }
  }

  async findProfile(searchTerm: string): Promise<FindPersonReturn[]> {
    const profiles = await ProfileModel.find({
      $or: [{ username: { $regex: `^${searchTerm}`, $options: 'i' } }],
    })
      .limit(10)
      .lean();

    const uniqueProfiles = profiles.filter(
      (person, index, self) =>
        self.findIndex((p) => p.username === person.username) === index
    );

    return uniqueProfiles.map((personDoc) => {
      const profile = ProfileMongoDTO.fromMongo(personDoc).toEntity();
      return {
        userId: profile.userId,
        profilePhoto: profile.profilePhoto,
        username: profile.username,
        nickname: profile.nickname,
      };
    });
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
}
