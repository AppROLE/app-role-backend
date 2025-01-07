import { PRIVACY_TYPE } from "src/shared/domain/enums/privacy_enum";
import { IUser } from "../models/user.model";
import {
  FavoriteProps,
  FollowingProps,
  Profile,
} from "src/shared/domain/entities/profile";
import { IUser as UserDocument } from "../models/user.model";
import { GENDER_TYPE } from "src/shared/domain/enums/gender_enum";

export interface UserMongoDTOProps {
  _id: string;
  name: string;
  email: string;
  nickname: string;
  username: string;
  acceptedTerms: boolean;
  emailVerified: boolean;
  dateBirth?: Date;
  cpf?: string;
  confirmationCode?: string;
  gender?: GENDER_TYPE;
  phoneNumber?: string;
  linkInstagram?: string;
  biography?: string;
  linkTiktok?: string;
  backgroundPhoto?: string;
  profilePhoto?: string;
  privacy: PRIVACY_TYPE;
  following: FollowingProps[];
  favorites: FavoriteProps[];
}

export class UserMongoDTO {
  private _id: string;
  private name: string;
  private email: string;
  private nickname: string;
  private username: string;
  private acceptedTerms: boolean;
  private emailVerified: boolean;
  private dateBirth?: Date;
  private cpf?: string;
  private confirmationCode?: string;
  private gender?: GENDER_TYPE;
  private biography?: string;
  private phoneNumber?: string;
  private linkInstagram?: string;
  private linkTiktok?: string;
  private backgroundPhoto?: string;
  private profilePhoto?: string;
  private privacy: PRIVACY_TYPE;
  private following: FollowingProps[];
  private favorites: FavoriteProps[];

  constructor(props: UserMongoDTOProps) {
    this._id = props._id;
    this.name = props.name;
    this.email = props.email;
    this.nickname = props.nickname;
    this.dateBirth = props.dateBirth;
    this.username = props.username;
    this.acceptedTerms = props.acceptedTerms;
    this.emailVerified = props.emailVerified;
    this.cpf = props.cpf;
    this.confirmationCode = props.confirmationCode;
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
  }

  static fromMongo(userDoc: IUser, needToObj: boolean): UserMongoDTO {
    const userObject = needToObj ? userDoc.toObject() : userDoc;

    return new UserMongoDTO({
      _id: userObject._id,
      name: userObject.name,
      email: userObject.email,
      nickname: userObject.nickname,
      emailVerified: userObject.email_verified,
      dateBirth: userObject.date_birth,
      username: userObject.username,
      acceptedTerms: userObject.accepted_terms,
      cpf: userObject.cpf,
      confirmationCode: userObject.confirmation_code,
      gender: userObject.gender,
      phoneNumber: userObject.phone_number,
      linkInstagram: userObject.lnk_instagram,
      linkTiktok: userObject.lnk_tiktok,
      backgroundPhoto: userObject.bg_photo,
      biography: userObject.biography,
      profilePhoto: userObject.profile_photo,
      privacy: userObject.privacy,
      following: userObject.following.map((following: any) => ({
        userFollowedId: following.user_followed_id,
        followedAt: following.followed_at,
      })),
      favorites: userObject.favorites.map((favorite: any) => ({
        instituteId: favorite.institute_id,
        favoritedAt: favorite.favorited_at,
      })),
    });
  }

  static toEntity(userMongoDTO: UserMongoDTO): Profile {
    return new Profile({
      userId: userMongoDTO._id,
      name: userMongoDTO.name,
      nickname: userMongoDTO.nickname,
      username: userMongoDTO.username,
      email: userMongoDTO.email,
      emailVerified: userMongoDTO.emailVerified,
      acceptedTerms: userMongoDTO.acceptedTerms,
      dateBirth: userMongoDTO.dateBirth,
      cpf: userMongoDTO.cpf,
      confirmationCode: userMongoDTO.confirmationCode,
      gender: userMongoDTO.gender,
      phoneNumber: userMongoDTO.phoneNumber,
      linkInstagram: userMongoDTO.linkInstagram,
      linkTiktok: userMongoDTO.linkTiktok,
      bgPhoto: userMongoDTO.backgroundPhoto,
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

  static fromEntity(user: Profile): UserMongoDTO {
    return new UserMongoDTO({
      _id: user.userId as string,
      name: user.userName,
      email: user.userEmail,
      nickname: user.userNickname as string,
      username: user.userUsername,
      acceptedTerms: user.userAcceptedTerms,
      emailVerified: user.userEmailVerified,
      dateBirth: user.userDateBirth,
      cpf: user.userCpf,
      confirmationCode: user.userConfirmationCode,
      gender: user.userGender,
      phoneNumber: user.userPhoneNumber,
      linkInstagram: user.userlinkInstagram,
      linkTiktok: user.userlinkTiktok,
      backgroundPhoto: user.userBgPhoto,
      biography: user.userBiography,
      profilePhoto: user.userProfilePhoto,
      privacy: user.userPrivacy as PRIVACY_TYPE,
      following: user.userFollowing.map((following) => ({
        userFollowedId: following.userFollowedId,
        followedAt: following.followedAt,
      })),
      favorites: user.userFavorites.map((favorite) => ({
        instituteId: favorite.instituteId,
        favoritedAt: favorite.favoritedAt,
      })),
    });
  }

  static toMongo(userMongoDTO: UserMongoDTO): UserDocument {
    return {
      _id: userMongoDTO._id,
      name: userMongoDTO.name,
      email: userMongoDTO.email,
      nickname: userMongoDTO.nickname,
      username: userMongoDTO.username,
      accepted_terms: userMongoDTO.acceptedTerms,
      cpf: userMongoDTO.cpf,
      email_verified: userMongoDTO.emailVerified,
      confirmation_code: userMongoDTO.confirmationCode,
      date_birth: userMongoDTO.dateBirth,
      biography: userMongoDTO.biography,
      phone_number: userMongoDTO.phoneNumber,
      gender: userMongoDTO.gender,
      lnk_instagram: userMongoDTO.linkInstagram,
      lnk_tiktok: userMongoDTO.linkTiktok,
      bg_photo: userMongoDTO.backgroundPhoto,
      profile_photo: userMongoDTO.profilePhoto,
      privacy: userMongoDTO.privacy,
      following: userMongoDTO.following.map((following) => ({
        user_followed_id: following.userFollowedId,
        followed_at: following.followedAt,
      })),
      favorites: userMongoDTO.favorites.map((favorite) => ({
        institute_id: favorite.instituteId,
        favorited_at: favorite.favoritedAt,
      })),
      created_at: new Date(),
    } as UserDocument;
  }
}
