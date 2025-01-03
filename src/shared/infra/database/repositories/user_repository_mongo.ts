import {
  DuplicatedItem,
  NoItemsFound,
} from "src/shared/helpers/errors/usecase_errors";
import { IUser } from "../../database/models/user.model";
import { UserMongoDTO } from "../../database/dtos/user_mongo_dto";
import { PRIVACY_TYPE } from "src/shared/domain/enums/privacy_enum";
import { IUserRepository } from "src/shared/domain/repositories/user_repository_interface";
import { GetProfileReturnType } from "src/shared/domain/types/get_profile_return_type";
import { Collection, Connection } from "mongoose";
import { User } from "src/shared/domain/entities/user";
import { GENDER_TYPE } from "src/shared/domain/enums/gender_enum";
import { FindPersonReturnType } from "src/shared/helpers/types/find_person_return_type";

export class UserRepositoryMongo implements IUserRepository {
  private userCollection: Collection<IUser>;

  constructor(connection: Connection) {
    this.userCollection = connection.collection<IUser>("user");
  }
  async findPerson(searchTerm: string): Promise<FindPersonReturnType[]> {
    const persons = await this.userCollection
      .find({
        $or: [
          { username: { $regex: `^${searchTerm}`, $options: "i" } },
          { nickname: { $regex: `^${searchTerm}`, $options: "i" } },
        ],
      })
      .limit(10)
      .toArray();

    const uniquePersons = persons.filter(
      (person, index, self) =>
        self.findIndex((p) => p.username === person.username) === index
    );

    return uniquePersons.map((personDoc) => {
      const personDto = UserMongoDTO.fromMongo(personDoc, false);
      const person = UserMongoDTO.toEntity(personDto);
      return {
        profilePhoto: person.userProfilePhoto,
        username: person.userUsername,
        nickname: person.userNickname as string,
      };
    });
  }

  async updateProfile(
    username: string,
    newUsername?: string,
    nickname?: string,
    biography?: string,
    instagramLink?: string,
    tiktokLink?: string
  ): Promise<boolean> {
    const userDoc = await this.userCollection.findOne({ username });

    if (!userDoc) {
      return false;
    }

    const updateFields: Partial<IUser> = {};

    if (newUsername) updateFields.username = newUsername;
    if (nickname) updateFields.nickname = nickname;
    if (biography) updateFields.biography = biography;
    if (instagramLink) updateFields.lnk_instagram = instagramLink;
    if (tiktokLink) updateFields.lnk_tiktok = tiktokLink;

    const result = await this.userCollection.updateOne(
      { username },
      { $set: updateFields }
    );

    if (!result.modifiedCount) {
      throw new Error("Erro ao atualizar o perfil.");
    }

    return true;
  }

  async followUser(username: string, followedUsername: string): Promise<void> {
    const userDoc = await this.userCollection.findOne({ username });
    if (!userDoc) {
      throw new NoItemsFound("username");
    }

    const followedUserDoc = await this.userCollection.findOne({
      username: followedUsername,
    });
    if (!followedUserDoc) {
      throw new NoItemsFound("followedUsername");
    }

    const userAlreadyFollows = userDoc.following.some(
      (follow) => follow.user_followed_id === followedUserDoc._id
    );

    const updatedFollowing = userAlreadyFollows
      ? userDoc.following.filter(
          (follow) => follow.user_followed_id !== followedUserDoc._id
        )
      : [...userDoc.following, { user_followed_id: followedUserDoc._id }];

    const result = await this.userCollection.updateOne(
      { username },
      { $set: { following: updatedFollowing } }
    );

    if (!result.modifiedCount) {
      throw new Error("Erro ao atualizar a lista de seguidores.");
    }
  }

  async getAllFollowers(username: string): Promise<User[]> {
    const userDoc = await this.userCollection.findOne({ username });
    if (!userDoc) {
      throw new NoItemsFound("username");
    }

    const followersDocs = await this.userCollection
      .find({ following: { $elemMatch: { user_followed_id: userDoc._id } } })
      .toArray();

    if (!followersDocs.length) {
      throw new NoItemsFound("followers");
    }

    return followersDocs.map((followerDoc) => {
      const followerDto = UserMongoDTO.fromMongo(followerDoc, false);
      return UserMongoDTO.toEntity(followerDto);
    });
  }

  async getAllFollowing(username: string): Promise<User[]> {
    const userDoc = await this.userCollection.findOne({ username });
    if (!userDoc) {
      throw new NoItemsFound("username");
    }

    const followingIds = userDoc.following.map(
      (follow) => follow.user_followed_id
    );

    if (!followingIds.length) {
      return [];
    }

    const followingDocs = await this.userCollection
      .find({ _id: { $in: followingIds } })
      .toArray();

    if (!followingDocs.length) {
      throw new NoItemsFound("following");
    }

    return followingDocs.map((followingDoc) => {
      const followingDto = UserMongoDTO.fromMongo(followingDoc, false);
      return UserMongoDTO.toEntity(followingDto);
    });
  }

  async changePrivacy(username: string, privacy: PRIVACY_TYPE): Promise<void> {
    const userDoc = await this.userCollection.findOne({ username });

    if (!userDoc) {
      throw new NoItemsFound("username");
    }

    const result = await this.userCollection.updateOne(
      { username },
      { $set: { privacy } }
    );

    if (!result.modifiedCount) {
      throw new Error("Erro ao alterar a privacidade do usuário.");
    }
  }

  async updateAccount(
    user_id: string,
    dateBirth?: Date,
    phoneNumber?: string,
    cpf?: string,
    gender?: GENDER_TYPE
  ): Promise<User | undefined> {
    const userDoc = await this.userCollection.findOne({ _id: user_id });

    if (!userDoc) {
      return undefined;
    }

    const updateFields: Partial<IUser> = {};

    if (dateBirth) updateFields.date_birth = dateBirth;
    if (phoneNumber) updateFields.phone_number = phoneNumber;
    if (cpf) updateFields.cpf = cpf;
    if (gender) updateFields.gender = gender;

    const result = await this.userCollection.updateOne(
      { _id: user_id },
      { $set: updateFields }
    );

    if (!result.modifiedCount) {
      throw new Error("Erro ao atualizar os dados do usuário.");
    }

    const updatedUserDoc = await this.userCollection.findOne({ _id: user_id });

    if (!updatedUserDoc) {
      throw new Error("Erro ao buscar os dados atualizados do usuário.");
    }

    const userDto = UserMongoDTO.fromMongo(updatedUserDoc, false);
    return UserMongoDTO.toEntity(userDto);
  }

  async validateIsOAuthUser(email: string): Promise<boolean> {
    const userDoc = await this.userCollection.findOne({ email });

    if (!userDoc) {
      return false;
    }

    return userDoc.is_oauth_user === true;
  }

  async changeUserIdsFromFollowing(
    oldUserId: string,
    newUserId: string
  ): Promise<void> {
    const result = await this.userCollection.updateMany(
      { "following.user_followed_id": oldUserId },
      { $set: { "following.$[elem].user_followed_id": newUserId } },
      {
        arrayFilters: [
          { "elem.user_followed_id": { $exists: true, $ne: null } },
        ],
      }
    );

    if (!result.modifiedCount) {
      throw new Error("Erro ao alterar IDs de usuários nos seguidores.");
    }
  }

  async removeAllFollowers(username: string): Promise<void> {
    const userDoc = await this.userCollection.findOne({ username });

    if (!userDoc) {
      throw new NoItemsFound("username");
    }

    await this.userCollection.updateOne(
      { username },
      { $set: { following: [] } }
    );

    await this.userCollection.updateMany(
      { "following.user_followed_id": userDoc._id },
      { $pull: { following: { user_followed_id: userDoc._id } } }
    );
  }

  async getAccountDetails(username: string): Promise<User> {
    const userDoc = await this.userCollection.findOne({ username });

    if (!userDoc) {
      throw new NoItemsFound("username");
    }

    const userDto = UserMongoDTO.fromMongo(userDoc, false);
    return UserMongoDTO.toEntity(userDto);
  }

  async createUser(user: User, isOAuth: boolean = false): Promise<User> {
    const userAlreadyExists = await this.userCollection.findOne({
      email: user.userEmail,
    });

    if (userAlreadyExists) {
      throw new DuplicatedItem("email");
    }

    const dto = UserMongoDTO.fromEntity(user);
    const userDoc = UserMongoDTO.toMongo(dto);
    userDoc.is_oauth_user = isOAuth;

    const result = await this.userCollection.insertOne(userDoc);

    if (!result.acknowledged) {
      throw new Error("Erro ao criar usuário no MongoDB.");
    }

    return user;
  }

  async deleteAccount(username: string, userId?: string): Promise<void> {
    if (!userId) {
      await this.userCollection.deleteOne({ username });
    } else {
      await this.userCollection.deleteOne({ _id: userId });
    }
  }

  async updateEmail(currentEmail: string, newEmail: string): Promise<void> {
    const userDoc = await this.userCollection.findOne({ email: currentEmail });

    if (!userDoc) {
      throw new NoItemsFound("email");
    }

    const result = await this.userCollection.updateOne(
      { email: currentEmail },
      { $set: { email: newEmail } }
    );

    if (!result.modifiedCount) {
      throw new Error("Erro ao atualizar o email.");
    }
  }

  async findByUsername(username: string): Promise<User | undefined> {
    const userDoc = await this.userCollection.findOne({ username });

    if (!userDoc) {
      return undefined;
    }

    const userDto = UserMongoDTO.fromMongo(userDoc, false);
    return UserMongoDTO.toEntity(userDto);
  }

  async createReview(
    star: number,
    review: string,
    reviewedAt: Date,
    instituteId: string,
    eventId: string,
    username: string
  ): Promise<void> {
    const userDoc = await this.userCollection.findOne({ username });

    if (!userDoc) {
      throw new NoItemsFound("username");
    }

    const reviewDoc = {
      star,
      review,
      reviewedAt,
      institute_id: instituteId,
      event_id: eventId,
    };

    const result = await this.userCollection.updateOne(
      { username },
      { $push: { reviews: reviewDoc } }
    );

    if (!result.modifiedCount) {
      throw new Error("Erro ao criar a avaliação.");
    }
  }

  async getFriends(username: string): Promise<User[]> {
    const userDoc = await this.userCollection.findOne({ username });

    if (!userDoc) {
      throw new NoItemsFound("username");
    }

    const friendsIds = userDoc.following.map((f) => f.user_followed_id);
    const friendsDocs = await this.userCollection
      .find({ _id: { $in: friendsIds } })
      .toArray();

    return friendsDocs.map((doc) =>
      UserMongoDTO.toEntity(UserMongoDTO.fromMongo(doc, false))
    );
  }

  async getAllReviewsByEvent(eventId: string): Promise<User[]> {
    const reviews = await this.userCollection
      .find({ "reviews.event_id": eventId })
      .toArray();

    if (!reviews.length) {
      throw new NoItemsFound("reviews");
    }

    return reviews.map((doc) =>
      UserMongoDTO.toEntity(UserMongoDTO.fromMongo(doc, false))
    );
  }

  async findByEmail(email: string): Promise<User | undefined> {
    const userDoc = await this.userCollection.findOne({ email });

    if (!userDoc) {
      return undefined;
    }

    const userDto = UserMongoDTO.fromMongo(userDoc, false);
    return UserMongoDTO.toEntity(userDto);
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

    const updatedFavorites = [
      ...userDoc.favorites,
      { institute_id: instituteId },
    ];

    const result = await this.userCollection.updateOne(
      { username },
      { $set: { favorites: updatedFavorites } }
    );

    if (!result.modifiedCount) {
      throw new Error("Erro ao atualizar os favoritos do usuário.");
    }
  }
}
