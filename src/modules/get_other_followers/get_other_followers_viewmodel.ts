import { Profile } from "src/shared/domain/entities/profile";

class ProfileViewmodel {
  userId: string;
  nickname: string;
  username: string;
  profilePhoto?: string;

  constructor(profile: Profile) {
    this.userId = profile.userId;
    this.nickname = profile.nickname;
    this.username = profile.username;
    this.profilePhoto = profile.profilePhoto;
  }

  toJSON() {
    return {
      userId: this.userId,
      nickname: this.nickname,
      username: this.username,
      profilePhoto: this.profilePhoto
    };
  }
}

export class GetOtherFollowersViewmodel {
  private profiles: ProfileViewmodel[];

  constructor(profiles: Profile[]) {
    this.profiles = profiles.map(
      (event) => new ProfileViewmodel(event)
    );
  }

  toJSON() {
    return {
      profile: this.profiles.map((profile) => profile.toJSON()),
      message: "Seguidores encontrados com sucesso",
    };
  }
}