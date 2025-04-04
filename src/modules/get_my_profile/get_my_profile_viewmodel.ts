import { Profile } from 'src/shared/domain/entities/profile';

class ProfileViewmodel {
  userId: string;
  nickname: string;
  username: string;
  biography?: string;
  linkInstagram?: string;
  linkTiktok?: string;
  backgroundPhoto?: string;
  profilePhoto?: string;
  followers: number;
  following: number;
  isPrivate: boolean;

  constructor(profile: Profile) {
    this.userId = profile.userId;
    this.nickname = profile.nickname;
    this.username = profile.username;
    this.biography = profile.biography;
    this.linkInstagram = profile.linkInstagram;
    this.linkTiktok = profile.linkTiktok;
    this.backgroundPhoto = profile.backgroundPhoto;
    this.profilePhoto = profile.profilePhoto;
    this.followers = profile.followers.length;
    this.following = profile.following.length;
    this.isPrivate = profile.isPrivate;
  }

  toJSON() {
    return {
      userId: this.userId,
      nickname: this.nickname,
      username: this.username,
      biography: this.biography,
      linkInstagram: this.linkInstagram,
      linkTiktok: this.linkTiktok,
      backgroundPhoto: this.backgroundPhoto,
      profilePhoto: this.profilePhoto,
      followersLength: this.followers,
      followingLength: this.following,
      isPrivate: this.isPrivate,
    };
  }
}

export class GetMyProfileViewmodel {
  private profile: ProfileViewmodel;

  constructor(profile: Profile) {
    this.profile = new ProfileViewmodel(profile);
  }

  toJSON() {
    return this.profile.toJSON();
  }
}
