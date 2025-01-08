import {
  DuplicatedItem,
  NoItemsFound,
} from "src/shared/helpers/errors/errors";
import { IProfile } from "../models/profile.model";
import { ProfileMongoDTO } from "../dtos/profile_mongo_dto";
import { PRIVACY_TYPE } from "src/shared/domain/enums/privacy_enum";
import { IProfileRepository } from "src/shared/domain/repositories/profile_repository_interface";
import { GetProfileReturnType } from "src/shared/domain/types/get_profile_return_type";
import { Collection, Connection } from "mongoose";
import { Profile } from "src/shared/domain/entities/profile";
import { GENDER_TYPE } from "src/shared/domain/enums/gender_enum";
import { FindPersonReturnType } from "src/shared/helpers/types/find_person_return_type";

export class ProfileRepositoryMongo implements IProfileRepository {
  private userCollection: Collection<IProfile>;

  constructor(connection: Connection) {
    this.userCollection = connection.collection<IProfile>("user");
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
      const personDto = ProfileMongoDTO.fromMongo(personDoc, false);
      const person = ProfileMongoDTO.toEntity(personDto);
      return {
        profilePhoto: person.profilePhoto,
        username: person.username,
        nickname: person.nickname as string,
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

    const updateFields: Partial<IProfile> = {};

    if (newUsername) updateFields.username = newUsername;
    if (nickname) updateFields.nickname = nickname;
    if (biography) updateFields.biography = biography;
    if (instagramLink) updateFields.linkInstagram = instagramLink;
    if (tiktokLink) updateFields.linkTiktok = tiktokLink;

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
      (follow) => follow.userFollowedId === followedUserDoc._id
    );

    const updatedFollowing = userAlreadyFollows
      ? userDoc.following.filter(
          (follow) => follow.userFollowedId !== followedUserDoc._id
        )
      : [...userDoc.following, { userFollowedId: followedUserDoc._id }];

    const result = await this.userCollection.updateOne(
      { username },
      { $set: { following: updatedFollowing } }
    );

    if (!result.modifiedCount) {
      throw new Error("Erro ao atualizar a lista de seguidores.");
    }
  }

  async getAllFollowers(username: string): Promise<Profile[]> {
    const userDoc = await this.userCollection.findOne({ username });
    if (!userDoc) {
      throw new NoItemsFound("username");
    }

    const followersDocs = await this.userCollection
      .find({ following: { $elemMatch: { userFollowedId: userDoc._id } } })
      .toArray();

    if (!followersDocs.length) {
      throw new NoItemsFound("followers");
    }

    return followersDocs.map((followerDoc) => {
      const followerDto = ProfileMongoDTO.fromMongo(followerDoc, false);
      return ProfileMongoDTO.toEntity(followerDto);
    });
  }

  async getAllFollowing(username: string): Promise<Profile[]> {
    const userDoc = await this.userCollection.findOne({ username });
    if (!userDoc) {
      throw new NoItemsFound("username");
    }

    const followingIds = userDoc.following.map(
      (follow) => follow.userFollowedId
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
      const followingDto = ProfileMongoDTO.fromMongo(followingDoc, false);
      return ProfileMongoDTO.toEntity(followingDto);
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
    userId: string,
    dateBirth?: Date,
    phoneNumber?: string,
    cpf?: string,
    gender?: GENDER_TYPE
  ): Promise<Profile | undefined> {
    const userDoc = await this.userCollection.findOne({ _id: userId });

    if (!userDoc) {
      return undefined;
    }

    const updateFields: Partial<IProfile> = {};

    if (dateBirth) updateFields.dateBirth = dateBirth;
    if (phoneNumber) updateFields.phoneNumber = phoneNumber;
    if (cpf) updateFields.cpf = cpf;
    if (gender) updateFields.gender = gender;

    const result = await this.userCollection.updateOne(
      { _id: userId },
      { $set: updateFields }
    );

    if (!result.modifiedCount) {
      throw new Error("Erro ao atualizar os dados do usuário.");
    }

    const updatedUserDoc = await this.userCollection.findOne({ _id: userId });

    if (!updatedUserDoc) {
      throw new Error("Erro ao buscar os dados atualizados do usuário.");
    }

    const userDto = ProfileMongoDTO.fromMongo(updatedUserDoc, false);
    return ProfileMongoDTO.toEntity(userDto);
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
      { "following.userFollowedId": oldUserId },
      { $set: { "following.$[elem].userFollowedId": newUserId } },
      {
        arrayFilters: [
          { "elem.userFollowedId": { $exists: true, $ne: null } },
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
      { "following.userFollowedId": userDoc._id },
      { $pull: { following: { userFollowedId: userDoc._id } } }
    );
  }

  async getAccountDetails(username: string): Promise<Profile> {
    const userDoc = await this.userCollection.findOne({ username });

    if (!userDoc) {
      throw new NoItemsFound("username");
    }

    const userDto = ProfileMongoDTO.fromMongo(userDoc, false);
    return ProfileMongoDTO.toEntity(userDto);
  }

  async createUser(user: Profile, isOAuth: boolean = false): Promise<Profile> {
    const userAlreadyExists = await this.userCollection.findOne({
      email: user.email,
    });

    if (userAlreadyExists) {
      throw new DuplicatedItem("email");
    }

    const dto = ProfileMongoDTO.fromEntity(user);
    const userDoc = ProfileMongoDTO.toMongo(dto);
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

  async findByUsername(username: string): Promise<Profile | undefined> {
    const userDoc = await this.userCollection.findOne({ username });

    if (!userDoc) {
      return undefined;
    }

    const userDto = ProfileMongoDTO.fromMongo(userDoc, false);
    return ProfileMongoDTO.toEntity(userDto);
  }

  async createReview(
    rating: number,
    review: string,
    createdAt: Date,
    instituteId: string,
    eventId: string,
    username: string
  ): Promise<void> {
    const userDoc = await this.userCollection.findOne({ username });

    if (!userDoc) {
      throw new NoItemsFound("username");
    }

    const reviewDoc = {
      rating,
      review,
      createdAt,
      instituteId: instituteId,
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

  async getFriends(username: string): Promise<Profile[]> {
    const userDoc = await this.userCollection.findOne({ username });

    if (!userDoc) {
      throw new NoItemsFound("username");
    }

    const friendsIds = userDoc.following.map((f) => f.userFollowedId);
    const friendsDocs = await this.userCollection
      .find({ _id: { $in: friendsIds } })
      .toArray();

    return friendsDocs.map((doc) =>
      ProfileMongoDTO.toEntity(ProfileMongoDTO.fromMongo(doc, false))
    );
  }

  async getAllReviewsByEvent(eventId: string): Promise<Profile[]> {
    const reviews = await this.userCollection
      .find({ "reviews.event_id": eventId })
      .toArray();

    if (!reviews.length) {
      throw new NoItemsFound("reviews");
    }

    return reviews.map((doc) =>
      ProfileMongoDTO.toEntity(ProfileMongoDTO.fromMongo(doc, false))
    );
  }

  async findByEmail(email: string): Promise<Profile | undefined> {
    const userDoc = await this.userCollection.findOne({ email });

    if (!userDoc) {
      return undefined;
    }

    const userDto = ProfileMongoDTO.fromMongo(userDoc, false);
    return ProfileMongoDTO.toEntity(userDto);
  }

  async getProfile(
    username: string,
    isAnotherUser: boolean,
    requesterUsername?: string
  ): Promise<GetProfileReturnType> {
    const userDoc = await this.userCollection.findOne({ username });
    if (!userDoc) throw new NoItemsFound("username");

    const userDto = ProfileMongoDTO.fromMongo(userDoc, false);
    const user = ProfileMongoDTO.toEntity(userDto);

    let isFriend: boolean | undefined;
    let isFollowing: boolean | undefined;

    const following: number = user.following.length;
    const followers = await this.userCollection.countDocuments({
      following: { $elemMatch: { userFollowedId: user.userId } },
    });

    if (isAnotherUser && requesterUsername) {
      const requesterUser = await this.userCollection.findOne({
        username: requesterUsername,
      });
      if (!requesterUser) throw new NoItemsFound("requesterUser");

      isFriend = requesterUser.following.some(
        (follow) => follow.userFollowedId === user.userId
      );
      isFollowing = user.following.some(
        (follow) => follow.userFollowedId === requesterUser._id
      );
    }

    return {
      userId: user.userId as string,
      username: user.username,
      nickname: user.nickname as string,
      linkTiktok: user.linkTiktok,
      backgroundPhoto: user.backgroundPhoto,
      profilePhoto: user.profilePhoto,
      linkInstagram: user.linkInstagram,
      biography: user.biography,
      privacy: user.privacy || PRIVACY_TYPE.PUBLIC,
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
      { instituteId: instituteId },
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
