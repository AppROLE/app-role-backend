import { PRIVACY_TYPE } from "src/shared/domain/enums/privacy_enum";
import { Profile } from "src/shared/domain/entities/profile";
import { GENDER_TYPE } from "src/shared/domain/enums/gender_enum";
import { IProfile, ProfileModel } from "../models/profile.model";
import { ROLE_TYPE } from "src/shared/domain/enums/role_type_enum";

export interface UserMongoDTOProps {
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
  followers: string[];
  following: string[];
  favorites: string[];
  reviewsId: string[];
  searchHistory: string[];
  presencesId: string[];
}

export class ProfileMongoDTO {
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
  following: string[];
  favorites: string[];
  reviewsId: string[];
  searchHistory: string[];
  followers: string[];
  presencesId: string[];

  constructor(props: UserMongoDTOProps) {
    this._id = props._id;
    this.name = props.name;
    this.email = props.email;
    this.nickname = props.nickname;
    this.dateBirth = props.dateBirth;
    this.username = props.username;
    this.acceptedTerms = props.acceptedTerms;
    this.cpf = props.cpf;
    this.gender = props.gender;
    this.phoneNumber = props.phoneNumber;
    this.linkInstagram = props.linkInstagram;
    this.biography = props.biography;
    this.linkTiktok = props.linkTiktok;
    this.backgroundPhoto = props.backgroundPhoto;
    this.profilePhoto = props.profilePhoto;
    this.privacy = props.privacy;
    this.followers = props.followers;
    this.following = props.following;
    this.favorites = props.favorites;
    this.reviewsId = props.reviewsId;
    this.createdAt = props.createdAt;
    this.updatedAt = props.updatedAt;
    this.role = props.role;
    this.acceptedTermsAt = props.acceptedTermsAt;
    this.searchHistory = props.searchHistory;
    this.presencesId = props.presencesId;
  }

  static fromMongo(profile: IProfile): ProfileMongoDTO {
    return new ProfileMongoDTO({
      _id: profile._id,
      name: profile.name,
      email: profile.email,
      nickname: profile.nickname,
      dateBirth: profile.dateBirth,
      username: profile.username,
      acceptedTerms: profile.acceptedTerms,
      acceptedTermsAt: profile.acceptedTermsAt,
      role: profile.role,
      cpf: profile.cpf,
      gender: profile.gender,
      phoneNumber: profile.phoneNumber,
      linkInstagram: profile.linkInstagram,
      linkTiktok: profile.linkTiktok,
      backgroundPhoto: profile.backgroundPhoto,
      biography: profile.biography,
      profilePhoto: profile.profilePhoto,
      privacy: profile.privacy,
      followers: profile.followers,
      following: profile.following,
      favorites: profile.favorites,
      reviewsId: profile.reviewsId,
      createdAt: profile.createdAt,
      updatedAt: profile.updatedAt,
      searchHistory: profile.searchHistory,
      presencesId: profile.presencesId,
    });
  }

  toEntity(): Profile {
    return new Profile({
      userId: this._id,
      name: this.name,
      nickname: this.nickname,
      username: this.username,
      email: this.email,
      acceptedTerms: this.acceptedTerms,
      role: this.role,
      acceptedTermsAt: this.acceptedTermsAt,
      updatedAt: this.updatedAt,
      createdAt: this.createdAt,
      reviewsId: this.reviewsId,
      dateBirth: this.dateBirth,
      cpf: this.cpf,
      gender: this.gender,
      phoneNumber: this.phoneNumber,
      linkInstagram: this.linkInstagram,
      linkTiktok: this.linkTiktok,
      backgroundPhoto: this.backgroundPhoto,
      biography: this.biography,
      profilePhoto: this.profilePhoto,
      privacy: this.privacy,
      followers: this.followers,
      following: this.following,
      favorites: this.favorites,
      searchHistory: this.searchHistory,
      presencesId: this.presencesId,
    });
  }

  static fromEntity(profile: Profile): ProfileMongoDTO {
    return new ProfileMongoDTO({
      _id: profile.userId as string,
      name: profile.name,
      email: profile.email,
      nickname: profile.nickname,
      username: profile.username,
      acceptedTerms: profile.acceptedTerms,
      acceptedTermsAt: profile.acceptedTermsAt,
      role: profile.role,
      updatedAt: profile.updatedAt,
      createdAt: profile.createdAt,
      reviewsId: profile.reviewsId,
      dateBirth: profile.dateBirth,
      cpf: profile.cpf,
      gender: profile.gender,
      phoneNumber: profile.phoneNumber,
      linkInstagram: profile.linkInstagram,
      linkTiktok: profile.linkTiktok,
      backgroundPhoto: profile.backgroundPhoto,
      biography: profile.biography,
      profilePhoto: profile.profilePhoto,
      privacy: profile.privacy as PRIVACY_TYPE,
      followers: profile.followers,
      following: profile.following,
      favorites: profile.favorites,
      searchHistory: profile.searchHistory,
      presencesId: profile.presencesId,
    });
  }

  toMongo(): IProfile {
    return new ProfileModel({
      _id: this._id,
      name: this.name,
      email: this.email,
      nickname: this.nickname,
      username: this.username,
      acceptedTerms: this.acceptedTerms,
      cpf: this.cpf,
      role: this.role,
      acceptedTermsAt: this.acceptedTermsAt,
      updatedAt: this.updatedAt,
      reviewsId: this.reviewsId,
      dateBirth: this.dateBirth,
      biography: this.biography,
      phoneNumber: this.phoneNumber,
      gender: this.gender,
      linkInstagram: this.linkInstagram,
      linkTiktok: this.linkTiktok,
      backgroundPhoto: this.backgroundPhoto,
      profilePhoto: this.profilePhoto,
      privacy: this.privacy,
      following: this.following,
      favorites: this.favorites,
      createdAt: this.createdAt,
      searchHistory: this.searchHistory,
      followers: this.followers,
      presencesId: this.presencesId,
    });
  }
}
