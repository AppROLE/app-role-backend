import { Validations } from "src/shared/helpers/utils/validations";
import { EntityError } from "../../helpers/errors/errors";
import { GENDER_TYPE } from "../enums/gender_enum";
import { PRIVACY_TYPE } from "../enums/privacy_enum";
import { ROLE_TYPE } from "../enums/role_type_enum";

interface ProfileProps {
  userId: string;
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

  constructor(props: ProfileProps) {
    if (Validations.validateUserId(props.userId)) {
      throw new EntityError("userId");
    }
    this.userId = props.userId;

    if (Validations.validateName(props.name)) {
      throw new EntityError("name");
    }
    this.name = props.name;

    if (!props.nickname) {
      this.nickname = props.name.split(" ")[0];
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

    if (Validations.validateRole(props.role)) {
      throw new EntityError("role");
    }
    this.role = props.role;

    if (
      props.linkInstagram &&
      Validations.validateInstagram(props.linkInstagram)
    ) {
      throw new EntityError("linkInstagram");
    }
    this.linkInstagram = props.linkInstagram;

    if (props.linkTiktok && Validations.validateTiktok(props.linkTiktok)) {
      throw new EntityError("linkTiktok");
    }
    this.linkTiktok = props.linkTiktok;

    if (props.biography && Validations.validateBiography(props.biography)) {
      throw new EntityError("biography");
    }
    this.biography = props.biography;

    if (props.backgroundPhoto && Validations.validateBackgroundPhoto(props.backgroundPhoto)) {
      throw new EntityError("backgroundPhoto");
    }
    this.backgroundPhoto = props.backgroundPhoto;

    if (
      props.profilePhoto &&
      Validations.validateProfilePhoto(props.profilePhoto)
    ) {
      throw new EntityError("profilePhoto");
    }
    this.profilePhoto = props.profilePhoto;

    if (!props.privacy) {
      this.privacy = PRIVACY_TYPE.PUBLIC;
    } else {
      if (Validations.validatePrivacy(props.privacy)) {
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

    if (props.gender && Validations.validateGender(props.gender)) {
      throw new EntityError("gênero");
    }
    this.gender = props.gender;

    if (props.phoneNumber && Validations.validatePhoneNumber(props.phoneNumber)) {
      throw new EntityError("phoneNumber");
    }
    this.phoneNumber = props.phoneNumber;

    this.createdAt = props.createdAt;
    this.updatedAt = props.updatedAt;

    if (!Profile.validateFollowing(props.following)) {
      throw new EntityError("following");
    }
    this.following = props.following || [];

    if (!Profile.validateFavorites(props.favorites)) {
      throw new EntityError("favorites");
    }
    this.favorites = props.favorites || [];

    this.reviewsId = props.reviewsId || [];
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
