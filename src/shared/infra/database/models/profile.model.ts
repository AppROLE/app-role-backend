import mongoose, { Schema, Document } from 'mongoose';
import { GENDER_TYPE } from 'src/shared/domain/enums/gender_enum';
import { ROLE_TYPE } from 'src/shared/domain/enums/role_type_enum';

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
  isPrivate: boolean;
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
  acceptedTermsAt: { type: Date },
  updatedAt: { type: Date },
  phoneNumber: { type: String },
  dateBirth: { type: Date },
  cpf: { type: String },
  gender: { type: String },
  biography: { type: String },
  createdAt: { type: Date },
  linkInstagram: { type: String },
  linkTiktok: { type: String },
  backgroundPhoto: { type: String },
  profilePhoto: { type: String },
  isPrivate: { type: Boolean, required: true },
  followers: [{ type: String, ref: 'profiles' }],
  following: [{ type: String, ref: 'profiles' }],
  favorites: [{ type: String, ref: 'institutes' }],
  reviewsId: [{ type: String, ref: 'reviews' }],
  searchHistory: [{ type: String }],
  presencesId: [{ type: String, ref: 'presences' }],
});

export const ProfileModel = mongoose.model<IProfile>('profiles', ProfileSchema);
