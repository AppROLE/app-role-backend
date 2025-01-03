import { FindPersonReturnType } from "src/shared/helpers/types/find_person_return_type";
import { User } from "../entities/user";
import { GENDER_TYPE } from "../enums/gender_enum";
import { GetProfileReturnType } from "../types/get_profile_return_type";

export interface IUserRepository {
  createUser(user: User, isOAuth?: boolean): Promise<User>;
  getProfile(
    username: string,
    isAnotherUser: boolean,
    requesterUsername?: string
  ): Promise<GetProfileReturnType>;
  deleteAccount(username: string, userId?: string): Promise<void>;
  findByUsername(username: string): Promise<User | undefined>;
  createReview(
    star: number,
    review: string,
    reviewedAt: Date,
    instituteId: string,
    eventId: string,
    username: string
  ): Promise<void>;
  getFriends(username: string): Promise<User[]>;
  getAllReviewsByEvent(eventId: string): Promise<User[]>;
  findPerson(searchTerm: string): Promise<FindPersonReturnType[]>;
  updateProfile(
    username: string,
    newUsername?: string,
    nickname?: string,
    biography?: string,
    instagramLink?: string,
    tiktokLink?: string,
    profilePhoto?: string,
    backgroundPhoto?: string
  ): Promise<boolean | null>;
  favoriteInstitute(username: string, instituteId: string): Promise<void>;
  followUser(username: string, followedUsername: string): Promise<void>;
  getAllFollowers(username: string): Promise<User[]>;
  getAllFollowing(username: string): Promise<User[]>;
  getAllFavoriteInstitutes(username: string): Promise<any>;
  changePrivacy(username: string, privacy: string): Promise<void>;
  updateEmail(username: string, newEmail: string): Promise<void>;
  updateAccount(
    user_id: string,
    dateBirth?: Date,
    phoneNumber?: string,
    cpf?: string,
    gender?: GENDER_TYPE
  ): Promise<User | undefined>;
  validateIsOAuthUser(email: string): Promise<boolean>;
  changeUserIdsFromFollowing(
    oldUserId: string,
    newUserId: string
  ): Promise<void>;
  removeAllFollowers(username: string): Promise<void>;
  getAccountDetails(username: string): Promise<User>;
  findByEmail(email: string): Promise<User | undefined>;
  getProfile(
    username: string,
    isAnotherUser: boolean,
    requesterUsername?: string
  ): Promise<GetProfileReturnType>;
  getAllFavoriteInstitutes(username: string): any; // Ajustado para retornar um array de favoritos
  favoriteInstitute(username: string, instituteId: string): Promise<void>;
}
