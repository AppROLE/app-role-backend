import { ISearchHistoryRepository } from "src/shared/domain/repositories/search_history_repository_interface";
import { SearchHistoryDTO } from "../../database/dtos/search_history_dto";
import { Collection, Connection } from "mongoose";
import { NoItemsFound } from "src/shared/helpers/errors/usecase_errors";
import { ISearchHistoryDocument } from "../models/search_history.model";

export class SearchHistoryRepositoryMongo implements ISearchHistoryRepository {
  private searchHistoryCollection: Collection<ISearchHistoryDocument>;

  constructor(connection: Connection) {
    this.searchHistoryCollection =
      connection.collection<ISearchHistoryDocument>("SearchHistory");
  }

  async addProfileSearch(
    username: string,
    profileSearch: {
      profileUsername: string;
      profileNickname: string;
      profilePhoto?: string;
    }
  ): Promise<void> {
    const hasTenSearches = await this.searchHistoryCollection.countDocuments({
      username,
    });

    const dto = new SearchHistoryDTO({
      username,
      profileSearch,
    });
    const searchHistory = SearchHistoryDTO.toMongo(dto);

    const searchHistoryDoc = await this.searchHistoryCollection.findOne({
      username,
      "profileSearch.profileUsername": profileSearch.profileUsername,
    });

    if (searchHistoryDoc) return;

    if (hasTenSearches !== 10) {
      const result = await this.searchHistoryCollection.insertOne(
        searchHistory
      );
      if (!result.acknowledged) {
        throw new Error("Failed to add profile search in MongoDB.");
      }
    } else {
      const oldestSearch = await this.searchHistoryCollection.findOne(
        { username },
        { sort: { created_at: 1 } }
      );
      if (oldestSearch) {
        await this.searchHistoryCollection.deleteOne({ _id: oldestSearch._id });
      }

      const result = await this.searchHistoryCollection.insertOne(
        searchHistory
      );
      if (!result.acknowledged) {
        throw new Error("Failed to replace oldest profile search in MongoDB.");
      }
    }
  }

  async removeProfileSearch(
    username: string,
    profileUsername: string
  ): Promise<void> {
    const result = await this.searchHistoryCollection.deleteOne({
      username,
      "profileSearch.profileUsername": profileUsername,
    });

    if (!result.deletedCount) {
      throw new NoItemsFound("search history");
    }
  }

  async clearProfileSearches(username: string): Promise<void> {
    await this.searchHistoryCollection.deleteMany({ username });
  }

  async getAllProfilesSearches(username: string): Promise<
    {
      profileUsername: string;
      profileNickname: string;
      profilePhoto?: string;
    }[]
  > {
    const searchHistoryDocs = await this.searchHistoryCollection
      .find({ username })
      .toArray();

    if (!searchHistoryDocs || searchHistoryDocs.length === 0) {
      return [];
    }

    return searchHistoryDocs.map(
      (doc) =>
        SearchHistoryDTO.toEntity(SearchHistoryDTO.fromMongo(doc)).profileSearch
    );
  }

  async removeProfileSearchesWhenUserChangesUsername(
    oldUsername: string
  ): Promise<void> {
    await this.searchHistoryCollection.deleteMany({
      "profileSearch.profileUsername": oldUsername,
    });
  }
}
