import {
  DuplicatedItem,
  NoItemsFound,
} from "src/shared/helpers/errors/usecase_errors";
import { connectDB } from "../../database/models";
import { IUser } from "../../database/models/user.model";
import { UserMongoDTO } from "../../database/dtos/user_mongo_dto";
import { PRIVACY_TYPE } from "src/shared/domain/enums/privacy_enum";
import { IUserRepository } from "src/shared/domain/irepositories/user_repository_interface";
import { GetProfileReturnType } from "src/shared/domain/types/get_profile_return_type";

export class UserRepositoryMongo implements IUserRepository {
  async getProfile(
    username: string,
    isAnotherUser: boolean,
    requesterUsername?: string
  ): Promise<GetProfileReturnType> {
    try {
      console.log("Connecting to MongoDB for getProfile...");
      const db = await connectDB();
      db.connections[0].on("error", () => {
        console.error("connection error:");
        throw new Error("Error connecting to MongoDB");
      });

      const userMongoClient = db.connections[0].db?.collection<IUser>("User");
      console.log("MongoDB collection acquired for User:", userMongoClient);

      console.log("Finding user document with username:", username);
      const userDoc = await userMongoClient?.findOne({ username });

      if (!userDoc) {
        console.log("No user found with username:", username);
        throw new NoItemsFound("username");
      }

      console.log("User document found:", userDoc);
      const userDto = UserMongoDTO.fromMongo(userDoc, false);
      const user = UserMongoDTO.toEntity(userDto);

      console.log("User entity converted from DTO:", user);

      let isFriend: boolean | undefined;
      let isFollowing: boolean | undefined;

      const following: number = user.userFollowing.length;
      console.log("User following count:", following);

      console.log("Counting followers of user with ID:", user.userId);
      let followers = await userMongoClient?.countDocuments({
        following: { $elemMatch: { user_followed_id: user.userId } },
      });

      if (!followers) {
        console.log("No followers found for user ID:", user.userId);
        followers = 0;
      }
      console.log("Followers count:", followers);

      if (isAnotherUser && requesterUsername) {
        console.log(
          "Checking if requesterUsername follows the user:",
          requesterUsername
        );
        const requesterUser = await userMongoClient?.findOne({
          username: requesterUsername,
        });

        if (!requesterUser) {
          console.log(
            "No requester user found with username:",
            requesterUsername
          );
          throw new NoItemsFound("requesterUser");
        }

        console.log("Requester user found:", requesterUser);

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
        privacy: user.userPrivacy ? user.userPrivacy : PRIVACY_TYPE.PUBLIC,
        following,
        followers,
        isFriend,
        isFollowing: isFriend ? isFriend : isFollowing,
      };
    } catch (error) {
      console.error("Error in getProfile:", error);
      throw new Error(`Error getting profile on MongoDB: ${error}`);
    }
  }

  async getAllFavoriteInstitutes(username: string): Promise<any> {
    try {
      console.log("Connecting to MongoDB for getAllFavoriteInstitutes...");
      const db = await connectDB();
      db.connections[0].on("error", () => {
        console.error("connection error:");
        throw new Error("Error connecting to MongoDB");
      });

      const userMongoClient = db.connections[0].db?.collection<IUser>("User");
      console.log("MongoDB collection acquired for User:", userMongoClient);

      console.log(
        "Finding user document with username for favorites:",
        username
      );
      const userDoc = await userMongoClient?.findOne(
        { username },
        { projection: { favorites: 1 } }
      );

      console.log("User document found for favorites:", userDoc);

      if (
        !userDoc ||
        !Array.isArray(userDoc.favorites) ||
        userDoc.favorites.length === 0
      ) {
        console.log("No favorites found for username:", username);
        throw new NoItemsFound("favorites");
      }

      console.log("Favorites retrieved for user:", userDoc.favorites);
      return userDoc.favorites;
    } catch (error) {
      if (error instanceof NoItemsFound) {
        console.warn("NoItemsFound error in getAllFavoriteInstitutes:", error);
        throw error;
      }
      console.error("Error retrieving favorites from MongoDB:", error);
      throw new Error(`Error retrieving favorites from MongoDB: ${error}`);
    }
  }
}
