import { ISearchHistoryRepository } from "src/shared/domain/irepositories/search_history_repository_interface";
import { connectDB } from "../../database/models";
import { SearchHistoryDocument } from "../../database/models/search_history.model";
import { SearchHistoryDTO } from "../../database/dtos/search_history_dto";

export class SearchHistoryRepositoryMongo implements ISearchHistoryRepository {
  async addProfileSearch(username: string, profileSearch: { profileUsername: string; profileNickname: string; profilePhoto?: string; }): Promise<void> {
    try {
      const db = await connectDB();
      db.connections[0].on("error", () => {
        console.error.bind(console, "connection error:");
        throw new Error("Error connecting to MongoDB");
      });

      const searchHistoryMongoClient = db.connections[0].db?.collection<SearchHistoryDocument>("SearchHistory");

      const hasTenSearches = await searchHistoryMongoClient?.countDocuments({ username });

      const dto = new SearchHistoryDTO({
        username,
        profileSearch,
      });

      const searchHistory = SearchHistoryDTO.toMongo(dto);

      // validate if the profileSearch already exists
      const searchHistoryDoc = await searchHistoryMongoClient?.findOne({ username, "profileSearch.profileUsername": profileSearch.profileUsername });
      if (searchHistoryDoc) return;

      if (hasTenSearches !== 10) await searchHistoryMongoClient?.insertOne(searchHistory)

      // If the user has 10 searches, remove the oldest by Date.now and add the new one
      if (hasTenSearches === 10) {
        const oldestSearch = await searchHistoryMongoClient?.findOne({ username }, { sort: { created_at: 1 } });
        await searchHistoryMongoClient?.deleteOne({ _id: oldestSearch?._id });

        await searchHistoryMongoClient?.insertOne(searchHistory);
      }

    } catch (error: any) {
      throw new Error(`SearchHistoryRepositoryMongo, Error on addProfileSearch: ${error.message}`);
    }
  }

  async removeProfileSearch(username: string, profileUsername: string): Promise<void> {
    try {
      const db = await connectDB();
      db.connections[0].on("error", () => {
        console.error.bind(console, "connection error:");
        throw new Error("Error connecting to MongoDB");
      });

      const searchHistoryMongoClient = db.connections[0].db?.collection<SearchHistoryDocument>("SearchHistory");

      await searchHistoryMongoClient?.deleteOne({ username, "profileSearch.profileUsername": profileUsername });

    } catch (error: any) {
      throw new Error(`SearchHistoryRepositoryMongo, Error on removeProfileSearch: ${error.message}`);
    }
  }

  async clearProfileSearches(username: string) {
    try {
      const db = await connectDB();
      db.connections[0].on("error", () => {
        console.error.bind(console, "connection error:");
        throw new Error("Error connecting to MongoDB");
      });

      const searchHistoryMongoClient = db.connections[0].db?.collection<SearchHistoryDocument>("SearchHistory");

      await searchHistoryMongoClient?.deleteMany({ username });

    } catch (error: any) {
      throw new Error(`SearchHistoryRepositoryMongo, Error on clearProfileSearches: ${error.message}`);
    }
  }

  async getAllProfilesSearches(username: string): Promise<{ profileUsername: string; profileNickname: string; profilePhoto?: string; }[]> {
    try {
      const db = await connectDB();
      db.connections[0].on("error", () => {
        console.error.bind(console, "connection error:");
        throw new Error("Error connecting to MongoDB");
      });

      const searchHistoryMongoClient = db.connections[0].db?.collection<SearchHistoryDocument>("SearchHistory");

      const searchHistoryDocs = await searchHistoryMongoClient?.find({ username }).toArray();

      if (!searchHistoryDocs) return [];

      const searchHistoryDTOs = searchHistoryDocs.map((searchHistoryDoc) => SearchHistoryDTO.fromMongo(searchHistoryDoc, false));

      const entities = searchHistoryDTOs.map((searchHistoryDTO) => SearchHistoryDTO.toEntity(searchHistoryDTO));

      return entities.map((entity) => entity.profileSearch);
    } catch(error: any) {
      throw new Error(`SearchHistoryRepositoryMongo, Error on getAllProfilesSearches: ${error.message}`);
    }
  }

  async removeProfileSearchesWhenUserChangesUsername(oldUsername: string): Promise<void> {
    try {
      const db = await connectDB();
      db.connections[0].on("error", () => {
        console.error.bind(console, "connection error:");
        throw new Error("Error connecting to MongoDB");
      });

      const searchHistoryMongoClient = db.connections[0].db?.collection<SearchHistoryDocument>("SearchHistory");

      // everyone who has searched for the old username will have their searches removed

      await searchHistoryMongoClient?.deleteMany({ "profileSearch.profileUsername": oldUsername });

    } catch (error: any) {
      throw new Error(`SearchHistoryRepositoryMongo, Error on removeProfileSearchesWhenUserChangesUsername: ${error.message}`);
    }
  }
}