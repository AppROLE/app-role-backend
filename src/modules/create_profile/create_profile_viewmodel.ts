import { Profile } from 'src/shared/domain/entities/profile';
import { ROLE_TYPE } from 'src/shared/domain/enums/role_type_enum';

export class CreateProfileViewmodel {
  userId: string;
  name: string;
  username: string;
  nickname: string;
  email: string;
  role: ROLE_TYPE;
  acceptedTerms: boolean;
  acceptedTermsAt?: number;
  createdAt: number;
  updatedAt: number;
  isPrivate: boolean;
  profilePhoto?: string;

  constructor(profile: Profile) {
    this.userId = profile.userId;
    this.name = profile.name;
    this.username = profile.username;
    this.nickname = profile.nickname;
    this.email = profile.email;
    this.role = profile.role;
    this.acceptedTerms = profile.acceptedTerms;
    this.acceptedTermsAt = profile.acceptedTermsAt;
    this.createdAt = profile.createdAt;
    this.updatedAt = profile.updatedAt;
    this.isPrivate = profile.isPrivate;
    this.profilePhoto = profile.profilePhoto;
  }

  toJSON() {
    return {
      userId: this.userId,
      name: this.name,
      username: this.username,
      nickname: this.nickname,
      email: this.email,
      role: this.role,
      acceptedTerms: this.acceptedTerms,
      acceptedTermsAt: this.acceptedTermsAt,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
      isPrivate: this.isPrivate,
      profilePhoto: this.profilePhoto,
    };
  }
}
