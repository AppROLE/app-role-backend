import mongoose, { Document, Schema } from "mongoose";
import { v4 as uuidv4 } from "uuid";

interface IProfileSearch {
  profileUsername: string;
  profileNickname: string;
  profilePhoto?: string;
}

const ProfileSearchSchema = new Schema<IProfileSearch>({
  profileUsername: { type: String, required: true },
  profileNickname: { type: String, required: true },
  profilePhoto: { type: String },
});

export interface ISearchHistoryDocument extends Document {
  _id: string;
  username: string;
  profileSearch: IProfileSearch;
  created_at: Date;
}

const SearchHistorySchema = new Schema<ISearchHistoryDocument>({
  _id: { type: String, default: uuidv4 },
  username: { type: String, required: true },
  profileSearch: { type: ProfileSearchSchema, required: true },
  created_at: { type: Date, default: Date.now },
});

export const SearchHistoryModel = mongoose.model<ISearchHistoryDocument>(
  "SearchHistory",
  SearchHistorySchema
);
