import { PRIVACY_TYPE } from "src/shared/domain/enums/privacy_enum";
import {
  FavoriteProps,
  FollowingProps,
  Profile,
} from "src/shared/domain/entities/profile";
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
  following: FollowingProps[];
  favorites: FavoriteProps[];
  reviewsId: string[];
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
  following: FollowingProps[];
  favorites: FavoriteProps[];
  reviewsId: string[];

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
    this.following = props.following;
    this.favorites = props.favorites;
    this.reviewsId = props.reviewsId;
    this.createdAt = props.createdAt;
    this.updatedAt = props.updatedAt;
    this.role = props.role;
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
      following: profile.following.map((following: any) => ({
        userFollowedId: following.userFollowedId,
        followedAt: following.followedAt,
      })),
      favorites: profile.favorites.map((favorite: any) => ({
        instituteId: favorite.instituteId,
        favoritedAt: favorite.favoritedAt,
      })),
      reviewsId: profile.reviewsId,
      createdAt: profile.createdAt,
      updatedAt: profile.updatedAt,
    });
  }

  static toEntity(userMongoDTO: ProfileMongoDTO): Profile {
    return new Profile({
      userId: userMongoDTO._id,
      name: userMongoDTO.name,
      nickname: userMongoDTO.nickname,
      username: userMongoDTO.username,
      email: userMongoDTO.email,
      acceptedTerms: userMongoDTO.acceptedTerms,
      role: userMongoDTO.role,
      acceptedTermsAt: userMongoDTO.acceptedTermsAt,
      updatedAt: userMongoDTO.updatedAt,
      createdAt: userMongoDTO.createdAt,
      reviewsId: userMongoDTO.reviewsId,
      dateBirth: userMongoDTO.dateBirth,
      cpf: userMongoDTO.cpf,
      gender: userMongoDTO.gender,
      phoneNumber: userMongoDTO.phoneNumber,
      linkInstagram: userMongoDTO.linkInstagram,
      linkTiktok: userMongoDTO.linkTiktok,
      backgroundPhoto: userMongoDTO.backgroundPhoto,
      biography: userMongoDTO.biography,
      profilePhoto: userMongoDTO.profilePhoto,
      privacy: userMongoDTO.privacy,
      following: userMongoDTO.following.map((following) => ({
        userFollowedId: following.userFollowedId,
        followedAt: following.followedAt,
      })),
      favorites: userMongoDTO.favorites.map((favorite) => ({
        instituteId: favorite.instituteId,
        favoritedAt: favorite.favoritedAt,
      })),
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
      following: profile.following.map((following) => ({
        userFollowedId: following.userFollowedId,
        followedAt: following.followedAt,
      })),
      favorites: profile.favorites.map((favorite) => ({
        instituteId: favorite.instituteId,
        favoritedAt: favorite.favoritedAt,
      })),
    });
  }

  static toMongo(userMongoDTO: ProfileMongoDTO): IProfile {
    return new ProfileModel({
      _id: userMongoDTO._id,
      name: userMongoDTO.name,
      email: userMongoDTO.email,
      nickname: userMongoDTO.nickname,
      username: userMongoDTO.username,
      acceptedTerms: userMongoDTO.acceptedTerms,
      cpf: userMongoDTO.cpf,
      role: userMongoDTO.role,
      acceptedTermsAt: userMongoDTO.acceptedTermsAt,
      updatedAt: userMongoDTO.updatedAt,
      reviewsId: userMongoDTO.reviewsId,
      dateBirth: userMongoDTO.dateBirth,
      biography: userMongoDTO.biography,
      phoneNumber: userMongoDTO.phoneNumber,
      gender: userMongoDTO.gender,
      linkInstagram: userMongoDTO.linkInstagram,
      linkTiktok: userMongoDTO.linkTiktok,
      backgroundPhoto: userMongoDTO.backgroundPhoto,
      profilePhoto: userMongoDTO.profilePhoto,
      privacy: userMongoDTO.privacy,
      following: userMongoDTO.following.map((following) => ({
        userFollowedId: following.userFollowedId,
        followedAt: following.followedAt,
      })),
      favorites: userMongoDTO.favorites.map((favorite) => ({
        instituteId: favorite.instituteId,
        favoritedAt: favorite.favoritedAt,
      })),
      createdAt: userMongoDTO.createdAt,
    });
  }
}
