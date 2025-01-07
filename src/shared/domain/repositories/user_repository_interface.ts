import { FindPersonReturnType } from "src/shared/helpers/types/find_person_return_type";
import { Profile } from "../entities/profile";
import { GENDER_TYPE } from "../enums/gender_enum";
import { GetProfileReturnType } from "../types/get_profile_return_type";

export interface IUserRepository {
  createUser(user: Profile, isOAuth?: boolean): Promise<Profile>;
  getProfile(
    username: string,
    isAnotherUser: boolean,
    requesterUsername?: string
  ): Promise<GetProfileReturnType>;
  deleteAccount(username: string, userId?: string): Promise<void>;
  findByUsername(username: string): Promise<Profile | undefined>;
  createReview(
    star: number,
    review: string,
    reviewedAt: Date,
    instituteId: string,
    eventId: string,
    username: string
  ): Promise<void>;
  getFriends(username: string): Promise<Profile[]>;
  getAllReviewsByEvent(eventId: string): Promise<Profile[]>;
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
  getAllFollowers(username: string): Promise<Profile[]>;
  getAllFollowing(username: string): Promise<Profile[]>;
  getAllFavoriteInstitutes(username: string): Promise<any>;
  changePrivacy(username: string, privacy: string): Promise<void>;
  updateEmail(username: string, newEmail: string): Promise<void>;
  updateAccount(
    userId: string,
    dateBirth?: Date,
    phoneNumber?: string,
    cpf?: string,
    gender?: GENDER_TYPE
  ): Promise<Profile | undefined>;
  validateIsOAuthUser(email: string): Promise<boolean>;
  changeUserIdsFromFollowing(
    oldUserId: string,
    newUserId: string
  ): Promise<void>;
  removeAllFollowers(username: string): Promise<void>;
  getAccountDetails(username: string): Promise<Profile>;
  findByEmail(email: string): Promise<Profile | undefined>;
  getProfile(
    username: string,
    isAnotherUser: boolean,
    requesterUsername?: string
  ): Promise<GetProfileReturnType>;
  getAllFavoriteInstitutes(username: string): any; // Ajustado para retornar um array de favoritos
  favoriteInstitute(username: string, instituteId: string): Promise<void>;
}
