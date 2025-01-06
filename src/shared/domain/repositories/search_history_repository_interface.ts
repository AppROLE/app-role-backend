export interface ISearchHistoryRepository {
  addProfileSearch(username: string, profileSearch: {
    profileUsername: string;
    profileNickname: string;
    profilePhoto?: string;
  }): Promise<void>;
  removeProfileSearch(username: string, profileUsername: string): Promise<void>;
  clearProfileSearches(username: string): Promise<void>;
  getAllProfilesSearches(username: string): Promise<{
    profileUsername: string;
    profileNickname: string;
    profilePhoto?: string;
  }[]>;
  removeProfileSearchesWhenUserChangesUsername(oldUsername: string): Promise<void>;
}