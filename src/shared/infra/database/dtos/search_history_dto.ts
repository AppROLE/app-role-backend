import { SearchHistory } from "src/shared/domain/entities/search_history";
import {
  ISearchHistoryDocument,
  SearchHistoryModel,
} from "../models/search_history.model";

export interface SearchHistoryDTOProps {
  _id?: string;
  username: string;
  profileSearch: {
    profileUsername: string;
    profileNickname: string;
    profilePhoto?: string;
  };
}

export class SearchHistoryDTO {
  private _id?: string;
  private username: string;
  private profileSearch: {
    profileUsername: string;
    profileNickname: string;
    profilePhoto?: string;
  };

  constructor(props: SearchHistoryDTOProps) {
    this._id = props._id;
    this.username = props.username;
    this.profileSearch = props.profileSearch;
  }

  static fromMongo(searchHistoryDoc: ISearchHistoryDocument): SearchHistoryDTO {
    return new SearchHistoryDTO({
      _id: searchHistoryDoc._id,
      username: searchHistoryDoc.username,
      profileSearch: {
        profileUsername: searchHistoryDoc.profileSearch.profileUsername,
        profileNickname: searchHistoryDoc.profileSearch.profileNickname,
        profilePhoto: searchHistoryDoc.profileSearch.profilePhoto,
      },
    });
  }

  static toMongo(searchHistoryDTO: SearchHistoryDTO): ISearchHistoryDocument {
    return new SearchHistoryModel({
      _id: searchHistoryDTO._id,
      username: searchHistoryDTO.username,
      profileSearch: {
        profileUsername: searchHistoryDTO.profileSearch.profileUsername,
        profileNickname: searchHistoryDTO.profileSearch.profileNickname,
        profilePhoto: searchHistoryDTO.profileSearch.profilePhoto,
      },
    });
  }

  static toEntity(searchHistoryDTO: SearchHistoryDTO): SearchHistory {
    return new SearchHistory({
      id: searchHistoryDTO._id,
      username: searchHistoryDTO.username,
      profileSearch: searchHistoryDTO.profileSearch,
    });
  }

  static fromEntity(searchHistory: SearchHistory): SearchHistoryDTO {
    return new SearchHistoryDTO({
      _id: searchHistory.id,
      username: searchHistory.username,
      profileSearch: searchHistory.profileSearch,
    });
  }
}
