import {
  DuplicatedItem,
  NoItemsFound,
} from "src/shared/helpers/errors/usecase_errors";
import { User } from "../../../domain/entities/user";
import { connectDB } from "../../database/models";
import { IUser } from "../../database/models/user.model";
import { UserMongoDTO } from "../../database/dtos/user_mongo_dto";
import { v4 as uuidv4 } from "uuid";
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
      const db = await connectDB();
      db.connections[0].on("error", () => {
        console.error.bind(console, "connection error:");
        throw new Error("Error connecting to MongoDB");
      });

      const userMongoClient = db.connections[0].db?.collection<IUser>("User");

      const userDoc = await userMongoClient?.findOne({ username });

      if (!userDoc) {
        throw new NoItemsFound("username");
      }

      console.log("MONGO REPO USER DOC: ", userDoc);

      const userDto = UserMongoDTO.fromMongo(userDoc, false);
      const user = UserMongoDTO.toEntity(userDto);

      let isFriend: boolean | undefined;
      let isFollowing: boolean | undefined;

      const following: number = user.userFollowing.length;
      let followers = await userMongoClient?.countDocuments({
        following: { $elemMatch: { user_followed_id: user.userId } },
      });
      if (!followers) {
        followers = 0;
      }

      if (isAnotherUser && requesterUsername) {
        console.log(
          "INSIDE IF ISANOTHERUSER, REQUESTERUSERNAME: ",
          requesterUsername
        );
        const requesterUser = await userMongoClient?.findOne({
          username: requesterUsername,
        });
        console.log("INSIDE IF ISANOTHERUSER, REQUESTERUSER: ", requesterUser);
        if (!requesterUser) {
          throw new NoItemsFound("requesterUser");
        }

        console.log(
          "INSIDE IF ISANOTHERUSER, REQUESTERUSER.FOLLOWING: ",
          requesterUser.following
        );
        console.log("INSIDE IF ISANOTHERUSER, USER: ", user.userFollowing);

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
      throw new Error(`Error getting profile on MongoDB: ${error}`);
    }
  }

  async getAllFavoriteInstitutes(username: string): Promise<any> {
    try {
        const db = await connectDB();
        db.connections[0].on("error", () => {
            console.error("connection error:");
            throw new Error("Error connecting to MongoDB");
        });

        const userMongoClient = db.connections[0].db?.collection<IUser>("User");

        const userDoc = await userMongoClient?.findOne(
            { username },
            { projection: { favorites: 1 } }
        );

        if (!userDoc || !Array.isArray(userDoc.favorites) || userDoc.favorites.length === 0) {
            throw new NoItemsFound("favorites");
        }

        return userDoc.favorites;
    } catch (error) {
        if (error instanceof NoItemsFound) {
            throw error;
        }
        throw new Error(`Error retrieving favorites from MongoDB: ${error}`);
    }
}
}
