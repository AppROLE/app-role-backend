import {
  DuplicatedItem,
  NoItemsFound,
} from "src/shared/helpers/errors/usecase_errors";
import { IUser } from "../../database/models/user.model";
import { UserMongoDTO } from "../../database/dtos/user_mongo_dto";
import { PRIVACY_TYPE } from "src/shared/domain/enums/privacy_enum";
import { IUserRepository } from "src/shared/domain/repositories/user_repository_interface";
import { GetProfileReturnType } from "src/shared/domain/types/get_profile_return_type";
import { IInstitute } from "../models/institute.model";
import { Collection, Connection } from "mongoose";

export class UserRepositoryMongo implements IUserRepository {
  private userCollection: Collection<IUser>;
  private instituteCollection: Collection<IInstitute>;

  constructor(connection: Connection) {
    this.userCollection = connection.collection<IUser>("user");
    this.instituteCollection = connection.collection<IInstitute>("institute");
  }

  async getProfile(
    username: string,
    isAnotherUser: boolean,
    requesterUsername?: string
  ): Promise<GetProfileReturnType> {
    const userDoc = await this.userCollection.findOne({ username });
    if (!userDoc) throw new NoItemsFound("username");

    const userDto = UserMongoDTO.fromMongo(userDoc, false);
    const user = UserMongoDTO.toEntity(userDto);

    let isFriend: boolean | undefined;
    let isFollowing: boolean | undefined;

    const following: number = user.userFollowing.length;
    const followers = await this.userCollection.countDocuments({
      following: { $elemMatch: { user_followed_id: user.userId } },
    });

    if (isAnotherUser && requesterUsername) {
      const requesterUser = await this.userCollection.findOne({
        username: requesterUsername,
      });
      if (!requesterUser) throw new NoItemsFound("requesterUser");

      isFriend = requesterUser.following.some(
        (follow) => follow.user_followed_id === user.userId
      );
      isFollowing = user.userFollowing.some(
        (follow) => follow.userFollowedId === requesterUser._id
      );
    }

    return {
      userId: user.userId as string,
      username: user.userUsername,
      nickname: user.userNickname as string,
      linkTiktok: user.userlinkTiktok,
      backgroundPhoto: user.userBgPhoto,
      profilePhoto: user.userProfilePhoto,
      linkInstagram: user.userlinkInstagram,
      biography: user.userBiography,
      privacy: user.userPrivacy || PRIVACY_TYPE.PUBLIC,
      following,
      followers,
      isFriend,
      isFollowing: isFriend ? isFriend : isFollowing,
    };
  }

  async getAllFavoriteInstitutes(username: string): Promise<any> {
    const userDoc = await this.userCollection.findOne(
      { username },
      { projection: { favorites: 1 } }
    );

    if (
      !userDoc ||
      !Array.isArray(userDoc.favorites) ||
      userDoc.favorites.length === 0
    ) {
      throw new NoItemsFound("favorites");
    }

    return userDoc.favorites;
  }

  async favoriteInstitute(
    username: string,
    instituteId: string
  ): Promise<void> {
    const userDoc = await this.userCollection.findOne({ username });
    if (!userDoc) throw new NoItemsFound("username");

    const instituteDoc = await this.instituteCollection.findOne({
      _id: instituteId,
    });
    if (!instituteDoc) throw new NoItemsFound("instituteId");

    const instituteIdExists = userDoc.favorites.some(
      (favorite) => favorite.institute_id === instituteId
    );

    let updatedFavorites;
    if (instituteIdExists) {
      updatedFavorites = userDoc.favorites.filter(
        (favorite) => favorite.institute_id !== instituteId
      );
    } else {
      updatedFavorites = [...userDoc.favorites, { institute_id: instituteId }];
    }

    const result = await this.userCollection.updateOne(
      { username },
      { $set: { favorites: updatedFavorites } }
    );

    if (!result.modifiedCount) {
      throw new Error("Erro ao atualizar os favoritos do usuário.");
    }
  }
}
