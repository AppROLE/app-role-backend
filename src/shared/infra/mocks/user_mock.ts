import { Profile } from "src/shared/domain/entities/profile";
import { PRIVACY_TYPE } from "src/shared/domain/enums/privacy_enum";

export class UserMock {
  public users: Profile[];

  constructor() {
    this.users = [
      new Profile({
        name: "Matue",
        nickname: "matue",
        username: "matue30praum",
        email: "matue@30praum.com",
        linkInstagram: "https://instagram.com/matue30praum",
        linkTiktok: "https://tiktok.com/matue30praum",
        backgroundPhoto: "https://example.com/backgroundPhoto1.jpg",
        profilePhoto: "https://example.com/profile1.jpg",
        acceptedTerms: true,
        emailVerified: true,
        privacy: PRIVACY_TYPE.PUBLIC,
        following: [
          { userFollowedId: "2", followedAt: new Date("2024-01-01") },
        ],
        favorites: [
          {
            instituteId: "1",
            favoritedAt: new Date("2024-01-10"),
          },
        ],
      }),
      new Profile({
        name: "User",
        nickname: "user",
        username: "user",
        email: "user@example.com",
        linkInstagram: "https://instagram.com/user",
        linkTiktok: "https://tiktok.com/user",
        acceptedTerms: true,
        emailVerified: true,
        privacy: PRIVACY_TYPE.PRIVATE,
        profilePhoto: "https://example.com/profile2.jpg",
        following: [
          { userFollowedId: "3", followedAt: new Date("2024-01-02") },
        ],
        favorites: [
          {
            instituteId: "2",
            favoritedAt: new Date("2024-01-20"),
          },
        ],
      }),
      new Profile({
        name: "User",
        nickname: "user",
        username: "user",
        email: "user@example.com",
        linkInstagram: "https://instagram.com/user",
        linkTiktok: "https://tiktok.com/user",
        acceptedTerms: true,
        emailVerified: true,
        privacy: PRIVACY_TYPE.PRIVATE,
        profilePhoto: "https://example.com/profile2.jpg",
        following: [
          { userFollowedId: "3", followedAt: new Date("2024-01-02") },
        ],
        favorites: [
          {
            instituteId: "2",
            favoritedAt: new Date("2024-01-20"),
          },
        ],
      }),
    ];
  }
}
