import { FindPersonReturn } from 'src/shared/helpers/types/find_person_return_type';
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
  findProfile(searchTerm: string): Promise<FindPersonReturn[]>;
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
}
