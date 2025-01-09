import { DuplicatedItem, NoItemsFound } from "src/shared/helpers/errors/errors";
import { IProfile } from "../models/profile.model";
import { ProfileMongoDTO } from "../dtos/profile_mongo_dto";
import { PRIVACY_TYPE } from "src/shared/domain/enums/privacy_enum";
import { IProfileRepository } from "src/shared/domain/repositories/profile_repository_interface";
import { Collection, Connection } from "mongoose";
import { Profile } from "src/shared/domain/entities/profile";
import { FindPersonReturnType } from "src/shared/helpers/types/find_person_return_type";

export class ProfileRepositoryMongo implements IProfileRepository {
  private userCollection: Collection<IProfile>;

  constructor(connection: Connection) {
    this.userCollection = connection.collection<IProfile>("user");
  }

  async getByEmail(email: string): Promise<Profile | null> {
    const userDoc = await this.userCollection.findOne({ email: email });

    if (!userDoc) {
      return null;
    }

    return ProfileMongoDTO.fromMongo(userDoc).toEntity();
  }

  async getByUsername(username: string): Promise<Profile | null> {
    const userDoc = await this.userCollection.findOne({ username: username });

    if (!userDoc) {
      return null;
    }

    return ProfileMongoDTO.fromMongo(userDoc).toEntity();
  }

  async getByUserId(userId: string): Promise<Profile | null> {
    const userDoc = await this.userCollection.findOne({ _id: userId });

    if (!userDoc) {
      return null;
    }

    return ProfileMongoDTO.fromMongo(userDoc).toEntity();
  }

  async getProfilesByIds(profilesId: string[]): Promise<Profile[]> {
    const profiles = await this.userCollection
      .find({ _id: { $in: profilesId } })
      .toArray();

    if (!profiles || profiles.length === 0) {
      return [];
    }

    return profiles.map((profileDoc) =>
      ProfileMongoDTO.fromMongo(profileDoc).toEntity()
    );
  }

  async createProfile(profile: Profile): Promise<Profile> {
    const profileDoc = ProfileMongoDTO.fromEntity(profile).toMongo();

    const result = await this.userCollection.insertOne(profileDoc);

    if (!result.acknowledged) {
      throw new Error("Erro ao criar usuário no MongoDB.");
    }

    const createdUserDoc = await this.userCollection.findOne({
      _id: profile.userId,
    });

    if (!createdUserDoc) {
      throw new Error("Erro ao buscar o usuário criado no MongoDB.");
    }

    return ProfileMongoDTO.fromMongo(createdUserDoc).toEntity();
  }

  async deleteProfile(userId: string): Promise<void> {
    const result = await this.userCollection.deleteOne({ _id: userId });

    if (!result.deletedCount || result.deletedCount === 0) {
      throw new Error(`Usuário com ID ${userId} nao encontrado.`);
    }
  }

  async findProfile(searchTerm: string): Promise<FindPersonReturnType[]> {
    const profiles = await this.userCollection
      .find({
        $or: [
          { username: { $regex: `^${searchTerm}`, $options: "i" } },
          { nickname: { $regex: `^${searchTerm}`, $options: "i" } },
        ],
      })
      .limit(10)
      .toArray();

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
    username?: string,
    nickname?: string,
    biography?: string,
    instagramLink?: string,
    tiktokLink?: string,
    profilePhoto?: string,
    backgroundPhoto?: string,
    privacy?: PRIVACY_TYPE
  ): Promise<Profile> {
    const updateFields: Partial<IProfile> = {};

    if (username) updateFields.username = username;
    if (nickname) updateFields.nickname = nickname;
    if (biography) updateFields.biography = biography;
    if (instagramLink) updateFields.linkInstagram = instagramLink;
    if (tiktokLink) updateFields.linkTiktok = tiktokLink;
    if (profilePhoto) updateFields.profilePhoto = profilePhoto;
    if (backgroundPhoto) updateFields.backgroundPhoto = backgroundPhoto;
    if (privacy) updateFields.privacy = privacy;

    const result = await this.userCollection.updateOne(
      { _id: userId },
      { $set: updateFields }
    );

    if (!result.modifiedCount) {
      throw new Error("Erro ao atualizar o perfil.");
    }

    const updatedUserDoc = await this.userCollection.findOne({ _id: userId });

    if (!updatedUserDoc) {
      throw new Error("Erro ao buscar o perfil atualizado.");
    }

    return ProfileMongoDTO.fromMongo(updatedUserDoc).toEntity();
  }

  async addFollower(
    followerUserId: string,
    followedUserId: string
  ): Promise<void> {
    // Verificar se já existe o seguidor no array de followers
    const followedUser = await this.userCollection.findOne({
      _id: followedUserId,
      followers: followerUserId,
    });

    if (followedUser) {
      throw new DuplicatedItem("O usuário já está seguindo este perfil.");
    }

    // Adiciona follower ao seguido
    const resultFollowed = await this.userCollection.updateOne(
      { _id: followedUserId },
      { $addToSet: { followers: followerUserId } }
    );

    if (!resultFollowed.modifiedCount) {
      throw new Error("Erro ao adicionar seguidor ao perfil seguido.");
    }

    // Adiciona seguido ao follower
    const resultFollowing = await this.userCollection.updateOne(
      { _id: followerUserId },
      { $addToSet: { following: followedUserId } }
    );

    if (!resultFollowing.modifiedCount) {
      // Em caso de falha no segundo update, desfaz o primeiro
      await this.userCollection.updateOne(
        { _id: followedUserId },
        { $pull: { followers: followerUserId } }
      );
      throw new Error("Erro ao adicionar seguido ao perfil do seguidor.");
    }
  }

  async removeFollower(
    followerUserId: string,
    followedUserId: string
  ): Promise<void> {
    // Remove do array followers do usuário seguido
    const resultFollowed = await this.userCollection.updateOne(
      { _id: followedUserId },
      { $pull: { followers: followerUserId } }
    );

    // Remove do array following do usuário seguidor
    const resultFollowing = await this.userCollection.updateOne(
      { _id: followerUserId },
      { $pull: { following: followedUserId } }
    );

    if (!resultFollowed.modifiedCount && !resultFollowing.modifiedCount) {
      throw new Error("Erro ao remover seguidor/seguido.");
    }
  }

  async addFavoriteInstitute(
    userId: string,
    instituteId: string
  ): Promise<void> {
    const result = await this.userCollection.updateOne(
      { _id: userId },
      { $addToSet: { favoriteInstitutes: instituteId } }
    );

    if (!result.modifiedCount) {
      throw new Error("Erro ao adicionar instituto favorito.");
    }
  }

  async removeFavoriteInstitute(
    userId: string,
    instituteId: string
  ): Promise<void> {
    const result = await this.userCollection.updateOne(
      { _id: userId },
      { $pull: { favoriteInstitutes: instituteId } }
    );

    if (!result.modifiedCount) {
      throw new Error("Erro ao remover instituto favorito.");
    }
  }

  async removeAllFavoriteInstitute(userId: string): Promise<void> {
    const result = await this.userCollection.updateOne(
      { _id: userId },
      { $set: { favoriteInstitutes: [] } }
    );

    if (!result.modifiedCount) {
      throw new Error("Erro ao remover todos os institutos favoritos.");
    }
  }
}
