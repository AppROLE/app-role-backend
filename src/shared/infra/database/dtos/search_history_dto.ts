import { SearchHistory } from "src/shared/domain/entities/search_history";
import {
  SearchHistoryDocument,
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

  static fromMongo(
    searchHistoryDoc: SearchHistoryDocument,
    needToObj: boolean
  ): SearchHistoryDTO {
    const searchHistoryObject = needToObj
      ? searchHistoryDoc.toObject()
      : searchHistoryDoc;

    return new SearchHistoryDTO({
      _id: searchHistoryObject._id,
      username: searchHistoryObject.username,
      profileSearch: {
        profileUsername: searchHistoryObject.profileSearch.profileUsername,
        profileNickname: searchHistoryObject.profileSearch.profileNickname,
        profilePhoto: searchHistoryObject.profileSearch.profilePhoto,
      },
    });
  }

  static toMongo(searchHistoryDTO: SearchHistoryDTO): SearchHistoryDocument {
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
