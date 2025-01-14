import { Validations } from 'src/shared/helpers/utils/validations';
import { EntityError } from '../../helpers/errors/errors';
import { GENDER_TYPE } from '../enums/gender_enum';
import { ROLE_TYPE } from '../enums/role_type_enum';

interface ProfileProps {
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
  isPrivate: boolean;
  followers: string[];
  following: string[];
  favorites: string[];
  reviewsId: string[];
  searchHistory: string[];
  presencesId: string[];
}

export class Profile {
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
  isPrivate: boolean;
  followers: string[];
  following: string[];
  favorites: string[];
  reviewsId: string[];
  searchHistory: string[];
  presencesId: string[];

  constructor(props: ProfileProps) {
    if (!Validations.validateUserId(props.userId)) {
      throw new EntityError('userId');
    }
    this.userId = props.userId;

    if (!Validations.validateName(props.name)) {
      throw new EntityError('name');
    }
    this.name = props.name;

    if (!props.nickname) {
      this.nickname = props.name.split(' ')[0];
    } else {
      this.nickname = props.nickname;
    }

    this.username = props.username;
    this.dateBirth = props.dateBirth;

    if (!Validations.validateEmail(props.email)) {
      throw new EntityError('email');
    }
    this.email = props.email;

    if (!Validations.validateRole(props.role)) {
      throw new EntityError('role');
    }
    this.role = props.role;

    if (
      props.linkInstagram &&
      !Validations.validateInstagram(props.linkInstagram)
    ) {
      throw new EntityError('linkInstagram');
    }
    this.linkInstagram = props.linkInstagram;

    if (props.linkTiktok && !Validations.validateTiktok(props.linkTiktok)) {
      throw new EntityError('linkTiktok');
    }
    this.linkTiktok = props.linkTiktok;

    if (props.biography && !Validations.validateBiography(props.biography)) {
      throw new EntityError('biography');
    }
    this.biography = props.biography;

    if (
      props.backgroundPhoto &&
      !Validations.validateBackgroundPhoto(props.backgroundPhoto)
    ) {
      throw new EntityError('backgroundPhoto');
    }
    this.backgroundPhoto = props.backgroundPhoto;

    if (
      props.profilePhoto &&
      !Validations.validateProfilePhoto(props.profilePhoto)
    ) {
      throw new EntityError('profilePhoto');
    }
    this.profilePhoto = props.profilePhoto;

    if (!Validations.validateIsPrivate(props.isPrivate)) {
      throw new EntityError('isPrivate');
    }
    this.isPrivate = props.isPrivate;

    this.acceptedTerms = props.acceptedTerms;
    this.acceptedTermsAt = props.acceptedTermsAt;

    if (!Validations.validateCpf(props.cpf)) {
      throw new EntityError('cpf');
    }
    this.cpf = props.cpf;

    if (props.gender && !Validations.validateGender(props.gender)) {
      throw new EntityError('gênero');
    }
    this.gender = props.gender;

    if (
      props.phoneNumber &&
      !Validations.validatePhoneNumber(props.phoneNumber)
    ) {
      throw new EntityError('phoneNumber');
    }
    this.phoneNumber = props.phoneNumber;
    this.createdAt = props.createdAt;
    this.updatedAt = props.updatedAt;
    this.following = props.following || [];
    this.favorites = props.favorites || [];
    this.reviewsId = props.reviewsId || [];
    this.searchHistory = props.searchHistory || [];
    this.presencesId = props.presencesId || [];
    this.followers = props.followers || [];
  }
}
