import mongoose, { Schema, Document } from 'mongoose';
import { GENDER_TYPE } from 'src/shared/domain/enums/gender_enum';
import { PRIVACY_TYPE } from 'src/shared/domain/enums/privacy_enum';
import { ROLE_TYPE } from 'src/shared/domain/enums/role_type_enum';

export interface IProfile extends Document {
  _id: string;
  name: string;
  nickname: string;
  username: string;
  email: string;
  role: ROLE_TYPE;
  acceptedTerms: boolean;
  acceptedTermsAt?: number;
  dateBirth?: number;
  gender?: GENDER_TYPE;
  cpf?: string;
  biography?: string;
  phoneNumber?: string;
  createdAt: number;
  updatedAt: number;
  linkInstagram?: string;
  linkTiktok?: string;
  backgroundPhoto?: string;
  profilePhoto?: string;
  privacy: PRIVACY_TYPE;
  followers: string[];
  following: string[];
  favorites: string[];
  reviewsId: string[];
  searchHistory: string[];
  presencesId: string[];
}

const ProfileSchema: Schema = new Schema<IProfile>({
  _id: { type: String, required: true },
  name: { type: String, required: true },
  username: { type: String, required: true, unique: true },
  nickname: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  acceptedTerms: { type: Boolean, required: true },
  role: { type: String, required: true },
  acceptedTermsAt: { type: Number },
  updatedAt: { type: Number },
  phoneNumber: { type: String },
  dateBirth: { type: Number },
  cpf: { type: String, unique: true },
  gender: { type: String },
  biography: { type: String },
  createdAt: { type: Number },
  linkInstagram: { type: String },
  linkTiktok: { type: String },
  backgroundPhoto: { type: String },
  profilePhoto: { type: String },
  privacy: { type: String },
  followers: [{ type: Schema.Types.ObjectId, ref: 'profiles' }],
  following: [{ type: Schema.Types.ObjectId, ref: 'profiles' }],
  favorites: [{ type: Schema.Types.ObjectId, ref: 'institutes' }],
  reviewsId: [{ type: Schema.Types.ObjectId, ref: 'reviews' }],
  searchHistory: [{ type: String }],
  presencesId: [{ type: Schema.Types.ObjectId, ref: 'presences' }],
});

export const ProfileModel = mongoose.model<IProfile>('profiles', ProfileSchema);
