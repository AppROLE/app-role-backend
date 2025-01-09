import { Profile } from "src/shared/domain/entities/profile";

export class ProfileViewmodel {
  userId: string;
  username: string;
  nickname: string;
  profilePhoto?: string;

  constructor(profile: Profile) {
    this.userId = profile.userId;
    this.username = profile.username;
    this.nickname = profile.nickname;
    this.profilePhoto = profile.profilePhoto;
  }

  toJSON() {
    return {
      userId: this.userId,
      username: this.username,
      nickname: this.nickname,
      profilePhoto: this.profilePhoto,
    };
  }
}

export class GetAllPresencesByEventIdViewmodel {
  private profiles: ProfileViewmodel[];

  constructor(profiles: Profile[]) {
    this.profiles = profiles.map((profile) => new ProfileViewmodel(profile));
  }

  toJSON() {
    return {
      profiles: this.profiles.map((profile) => profile.toJSON()),
      message: "Presenças encontradas com sucesso",
    };
  }
}
