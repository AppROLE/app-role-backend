import { ProfileCardReturn } from 'src/shared/helpers/types/profile_card_return';
import { Profile } from '../entities/profile';
import { PaginationReturn } from 'src/shared/helpers/types/event_pagination';
import { EventCardReturn } from 'src/shared/helpers/types/event_card_return';

export interface IProfileRepository {
  getByEmail(email: string): Promise<Profile | null>;
  getByUsername(username: string): Promise<Profile | null>;
  getByUserId(userId: string): Promise<Profile | null>;
  getAllProfilesPagination(
    page: number,
    profilesId: string[]
  ): Promise<PaginationReturn<Profile>>;
  createProfile(profile: Profile): Promise<Profile>;
  deleteProfile(userId: string): Promise<void>;
  findProfile(
    searchTerm: string,
    myUserId: string,
    page: number
  ): Promise<PaginationReturn<ProfileCardReturn>>;
  getProfilesWithFriendshipPriority(
    profileIds: string[],
    myUserId: string,
    page: number
  ): Promise<PaginationReturn<ProfileCardReturn>>;
  updateProfile(
    userId: string,
    updateFields: Partial<Profile>
  ): Promise<Profile>;
  addFavoriteInstitute(userId: string, instituteId: string): Promise<void>;
  removeFavoriteInstitute(userId: string, instituteId: string): Promise<void>;
  removeAllFavoriteInstitute(userId: string): Promise<void>;
  getConfirmedPresencesEventCardsForProfile(
    userId: string,
    page: number
  ): Promise<PaginationReturn<EventCardReturn>>;
  getHistoricPresencesEventCardsForProfile(
    userId: string,
    page: number
  ): Promise<PaginationReturn<EventCardReturn>>;
  followProfile(myUserId: string, userId: string): Promise<void>;
  unfollowProfile(myUserId: string, userId: string): Promise<void>;
}
