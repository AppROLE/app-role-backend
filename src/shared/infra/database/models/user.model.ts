import mongoose, { Schema, Document } from "mongoose";
import { GENDER_TYPE } from "src/shared/domain/enums/gender_enum";

interface IFollowing {
  user_followed_id: string;
  followed_at?: Date;
}

interface IFavorite {
  institute_id: string;
  favorited_at?: Date;
}

interface IReview {
  institute_id: string;
  event_id: string;
  star: number;
  review: string;
  reviewed_at?: Date;
}

export interface IUser extends Document {
  _id: string;
  name: string;
  username: string;
  nickname: string;
  email: string;
  accepted_terms: boolean;
  email_verified: boolean;
  is_oauth_user?: boolean;
  date_birth?: Date;
  phone_number?: string;
  confirmation_code?: string;
  cpf?: string;
  gender?: GENDER_TYPE;
  biography?: string;
  created_at: Date;
  lnk_instagram?: string;
  lnk_tiktok?: string;
  bg_photo?: string;
  profile_photo?: string;
  privacy: string;
  following: IFollowing[];
  favorites: IFavorite[];
  reviews: IReview[];
}

const FollowingSchema = new Schema<IFollowing>({
  user_followed_id: { type: String, ref: "User" },
  followed_at: { type: Date, default: Date.now },
});

const FavoriteSchema = new Schema<IFavorite>({
  institute_id: { type: String, ref: "Institute" },
  favorited_at: { type: Date, default: Date.now },
});

const ReviewSchema = new Schema<IReview>({
  institute_id: { type: String, ref: "Institute" },
  event_id: { type: String, ref: "Event" },
  star: { type: Number, required: true },
  review: { type: String, required: true },
  reviewed_at: { type: Date, default: Date.now },
});

const UserSchema: Schema = new Schema<IUser>({
  _id: { type: String, required: true },
  name: { type: String, required: true },
  email_verified: { type: Boolean, default: false },
  username: { type: String, required: true, unique: true },
  nickname: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  accepted_terms: { type: Boolean, required: true },
  is_oauth_user: { type: Boolean, default: false },
  phone_number: { type: String },
  date_birth: { type: Date },
  cpf: { type: String, unique: true },
  confirmation_code: { type: String },
  gender: { type: GENDER_TYPE },
  biography: { type: String },
  created_at: { type: Date, default: Date.now },
  lnk_instagram: { type: String },
  lnk_tiktok: { type: String },
  bg_photo: { type: String },
  profile_photo: { type: String },
  privacy: { type: String },
  following: [FollowingSchema],
  favorites: [FavoriteSchema],
  reviews: [ReviewSchema],
});

export const userModel = mongoose.model<IUser>("User", UserSchema);
