import mongoose, { Schema, Document } from "mongoose";
import { GENDER_TYPE } from "src/shared/domain/enums/gender_enum";
import { PRIVACY_TYPE } from "src/shared/domain/enums/privacy_enum";
import { ROLE_TYPE } from "src/shared/domain/enums/role_type_enum";

interface IFollowing {
  userFollowedId: string;
  followedAt?: Date;
}

interface IFavorite {
  instituteId: string;
  favoritedAt?: Date;
}

export interface IProfile extends Document {
  _id: string;
  name: string;
  nickname: string;
  username: string;
  email: string;
  role: ROLE_TYPE;
  acceptedTerms: boolean;
  acceptedTermsAt?: Date;
  dateBirth?: Date;
  gender?: GENDER_TYPE;
  cpf?: string;
  biography?: string;
  phoneNumber?: string;
  createdAt: Date;
  updatedAt: Date;
  linkInstagram?: string;
  linkTiktok?: string;
  backgroundPhoto?: string;
  profilePhoto?: string;
  privacy: PRIVACY_TYPE;  
  following: IFollowing[];
  favorites: IFavorite[];
  reviewsId: string[];
}

const FollowingSchema = new Schema<IFollowing>({
  userFollowedId: { type: String, ref: "User" },
  followedAt: { type: Date, default: Date.now },
});

const FavoriteSchema = new Schema<IFavorite>({
  instituteId: { type: String, ref: "Institute" },
  favoritedAt: { type: Date, default: Date.now },
});

const ProfileSchema: Schema = new Schema<IProfile>({
  _id: { type: String, required: true },
  name: { type: String, required: true },
  username: { type: String, required: true, unique: true },
  nickname: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  acceptedTerms: { type: Boolean, required: true },
  role: { type: String, required: true },
  acceptedTermsAt: { type: Date },
  updatedAt: { type: Date, default: Date.now },
  phoneNumber: { type: String },
  dateBirth: { type: Date },
  cpf: { type: String, unique: true },
  gender: { type: GENDER_TYPE },
  biography: { type: String },
  createdAt: { type: Date, default: Date.now },
  linkInstagram: { type: String },
  linkTiktok: { type: String },
  backgroundPhoto: { type: String },
  profilePhoto: { type: String },
  privacy: { type: String },
  following: [FollowingSchema],
  favorites: [FavoriteSchema],
  reviewsId: [{ type: Schema.Types.ObjectId, ref: "Review" }],
});

export const ProfileModel = mongoose.model<IProfile>("Profile", ProfileSchema);
