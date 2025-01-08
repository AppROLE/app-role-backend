import { Validations } from "src/shared/helpers/utils/validations";
import { EntityError } from "../../helpers/errors/domain_errors";
import { GENDER_TYPE } from "../enums/gender_enum";
import { PRIVACY_TYPE } from "../enums/privacy_enum";
import { ROLE_TYPE } from "../enums/role_type_enum";

interface ProfileProps {
  userId: string;
  name: string;
  nickname: string;
  username: string;
  email: string;
  acceptedTerms: boolean;
  acceptedTermsAt: Date;
  dateBirth?: Date;
  gender?: GENDER_TYPE;
  cpf?: string;
  biography?: string;
  role?: ROLE_TYPE;
  phoneNumber?: string;
  createdAt?: Date;
  linkInstagram?: string;
  linkTiktok?: string;
  bgPhoto?: string;
  profilePhoto?: string;
  privacy?: PRIVACY_TYPE;
  following?: FollowingProps[];
  favorites?: FavoriteProps[];
}

export interface FollowingProps {
  userFollowedId: string;
  followedAt?: Date;
}

export interface FavoriteProps {
  instituteId: string;
  favoritedAt?: Date;
}

export class Profile {
  userId: string;
  name: string;
  nickname?: string;
  username: string;
  email: string;
  acceptedTerms: boolean;
  acceptedTermsAt: Date;
  dateBirth?: Date;
  cpf?: string;
  gender?: GENDER_TYPE;
  biography?: string;
  role?: ROLE_TYPE;
  phoneNumber?: string;
  link_instagram?: string;
  link_tiktok?: string;
  bg_photo?: string;
  profile_photo?: string;
  privacy?: PRIVACY_TYPE;
  created_at: Date;
  following: FollowingProps[];
  favorites: FavoriteProps[];

  constructor(props: ProfileProps) {
    if (Validations.validateUserId(props.userId)) {
      throw new EntityError("userId");
    }
    this.userId = props.userId;

    if (Validations.validateName(props.name)) {
      throw new EntityError("name");
    }
    this.name = props.name;

    if (!Profile.validateNickname(props.nickname)) {
      throw new EntityError("nickname");
    }
    if (!props.nickname) {
      props.nickname = props.name.split(" ")[0];
    } else {
      this.nickname = props.nickname;
    }

    if (Validations.validateUsername(props.username)) {
      throw new EntityError("username");
    }
    this.username = props.username;

    if (props.dateBirth && props.dateBirth > new Date()) {
      throw new EntityError("dateBirth");
    }
    this.dateBirth = props.dateBirth;

    if (Validations.validateEmail(props.email)) {
      throw new EntityError("email");
    }
    this.email = props.email;

    if (Validations.validaterole(props.role)) {
      throw new EntityError("role");
    }
    this.role = props.role;

    if (
      props.linkInstagram &&
      !Profile.validateInstagram(props.linkInstagram)
    ) {
      throw new EntityError("linkInstagram");
    }
    this.link_instagram = props.linkInstagram;

    if (props.linkTiktok && !Profile.validateTiktok(props.linkTiktok)) {
      throw new EntityError("linkTiktok");
    }
    this.link_tiktok = props.linkTiktok;

    if (props.biography && !Profile.validateBiography(props.biography)) {
      throw new EntityError("biography");
    }
    this.biography = props.biography;

    if (props.bgPhoto && !Profile.validateBgPhoto(props.bgPhoto)) {
      throw new EntityError("bgPhoto");
    }
    this.bg_photo = props.bgPhoto;

    if (
      props.profilePhoto &&
      !Profile.validateProfilePhoto(props.profilePhoto)
    ) {
      throw new EntityError("profilePhoto");
    }
    this.profile_photo = props.profilePhoto;

    if (!props.privacy) {
      this.privacy = PRIVACY_TYPE.PUBLIC;
    } else {
      if (!Profile.validatePrivacy(props.privacy)) {
        throw new EntityError("privacy");
      }
      this.privacy = props.privacy;
    }

    this.acceptedTerms = props.acceptedTerms;
    this.acceptedTermsAt = props.acceptedTermsAt;

    if (Validations.validateCpf(props.cpf)) {
      throw new EntityError("cpf");
    }
    this.cpf = props.cpf;

    if (props.gender && !Profile.validateGender(props.gender)) {
      throw new EntityError("gênero");
    }
    this.gender = props.gender;

    if (props.phoneNumber && !Profile.validatePhoneNumber(props.phoneNumber)) {
      throw new EntityError("phoneNumber");
    }
    this.phoneNumber = props.phoneNumber;

    this.following = props.following || [];
    this.favorites = props.favorites || [];
    this.created_at = props.createdAt || new Date();
  }

  static validateNickname(nickname: string): boolean {
    if (nickname && nickname.trim().length > 50) {
      return false;
    }
    return true;
  }

  static validateGender(gender?: GENDER_TYPE): boolean {
    if (gender && !Object.values(GENDER_TYPE).includes(gender)) {
      return false;
    }

    return true;
  }

  static validateBiography(biography?: string): boolean {
    if (biography && biography.trim().length > 1000) {
      return false;
    }
    if (biography && biography.trim().length === 0) {
      return false;
    }

    return true;
  }

  static validatePhoneNumber(phoneNumber?: string): boolean {
    if (phoneNumber && phoneNumber.trim().length > 20) {
      return false;
    }

    return true;
  }

  static validateInstagram(linkInstagram?: string): boolean {
    if (linkInstagram && linkInstagram.trim().length > 255) {
      return false;
    }

    return true;
  }

  static validateTiktok(linkTiktok?: string): boolean {
    if (linkTiktok && linkTiktok.trim().length > 255) {
      return false;
    }

    return true;
  }

  static validateBgPhoto(bgPhoto?: string): boolean {
    if (bgPhoto && bgPhoto.trim().length > 255) {
      return false;
    }

    return true;
  }

  static validateProfilePhoto(profilePhoto?: string): boolean {
    if (profilePhoto && profilePhoto.trim().length > 255) {
      return false;
    }

    return true;
  }

  static validatePrivacy(privacy?: PRIVACY_TYPE): boolean {
    if (!privacy || !Object.values(PRIVACY_TYPE).includes(privacy)) {
      return false;
    }

    return true;
  }

  static validateFollowing(following?: FollowingProps[]): boolean {
    if (following && !Array.isArray(following)) {
      return false;
    }
    following?.forEach((f) => {
      if (!f.userFollowedId || f.userFollowedId.trim().length === 0) {
        return false;
      }
    });

    return true;
  }

  static validateFavorites(favorites?: FavoriteProps[]): boolean {
    if (favorites && !Array.isArray(favorites)) {
      return false;
    }
    favorites?.forEach((f) => {
      if (!f.instituteId || f.instituteId.trim().length === 0) {
        return false;
      }
    });
    return true;
  }
}
