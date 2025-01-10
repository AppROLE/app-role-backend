import { FindPersonReturnType } from 'src/shared/helpers/types/find_person_return_type';
import { Profile } from '../entities/profile';
import { GENDER_TYPE } from '../enums/gender_enum';
import { GetProfileReturnType } from '../types/get_profile_return_type';

export interface IProfileRepository {
  getByEmail(email: string): Promise<Profile | null>;
  getByUsername(username: string): Promise<Profile | null>;
  getByUserId(userId: string): Promise<Profile | null>;
  getProfilesByIds(profilesId: string[]): Promise<Profile[]>;
  createProfile(profile: Profile): Promise<Profile>;
  deleteProfile(userId: string): Promise<void>;
  findProfile(searchTerm: string): Promise<FindPersonReturnType[]>;
  updateProfile(
    userId: string,
    updateFields: Partial<Profile>
  ): Promise<Profile>;
  addFollower(followerUserId: string, followedUserId: string): Promise<void>;
  removeFollower(followerUserId: string, followedUserId: string): Promise<void>;
  addFavoriteInstitute(userId: string, instituteId: string): Promise<void>;
  removeFavoriteInstitute(userId: string, instituteId: string): Promise<void>;
  removeAllFavoriteInstitute(userId: string): Promise<void>;
}
