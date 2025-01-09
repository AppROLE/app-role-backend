import { Profile } from "src/shared/domain/entities/profile";

export class GetProfileViewmodel {
  userId: string;
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

  constructor(profile: Profile) {
    this.userId = userId;
    this.nickname = nickname;
    this.username = username;
    this.following = following;
    this.privacy = privacy;
    this.followers = followers;
    this.linkTiktok = linkTiktok;
    this.backgroundPhoto = backgroundPhoto;
    this.profilePhoto = profilePhoto;
    this.biography = biography;
    this.linkInstagram = linkInstagram;
    this.isFriend = isFriend;
    this.isFollowing = isFollowing;
    this.email = email;
  }

  toJSON() {
    return {
      userId: this.userId,
      nickname: this.nickname,
      username: this.username,
      email: this.email,
      linkTiktok: this.linkTiktok,
      linkInstagram: this.linkInstagram,
      backgroundPhoto: this.backgroundPhoto,
      profilePhoto: this.profilePhoto,
      privacy: this.privacy,
      biography: this.biography,
      following: this.following,
      followers: this.followers,
      isFriend: this.isFriend,
      isFollowing: this.isFollowing,
    };
  }
}
