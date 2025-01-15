import { Validations } from 'src/shared/helpers/utils/validations';
import { EntityError } from '../../helpers/errors/errors';
import { GENDER_TYPE } from '../enums/gender_enum';
import { ROLE_TYPE } from '../enums/role_type_enum';

export interface ProfileProps {
  userId: string;
  name: string;
  nickname?: string;
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
  followers?: string[];
  following?: string[];
  favorites?: string[];
  reviewsId?: string[];
  searchHistory?: string[];
  presencesId?: string[];
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
    // Validações
    if (!props.userId || typeof props.userId !== 'string') {
      throw new EntityError('ID do usuário inválido.');
    }

    if (!props.name || props.name.trim().length < 3) {
      throw new EntityError(
        'Nome inválido. Deve conter pelo menos 3 caracteres.'
      );
    }

    if (!props.username || props.username.trim().length < 3) {
      throw new EntityError(
        'Username inválido. Deve conter pelo menos 3 caracteres.'
      );
    }

    if (!props.email || !Validations.validateEmail(props.email)) {
      throw new EntityError('Email inválido.');
    }

    if (!props.role || !Object.values(ROLE_TYPE).includes(props.role)) {
      throw new EntityError('Tipo de role inválido.');
    }

    if (typeof props.isPrivate !== 'boolean') {
      throw new EntityError('O campo isPrivate deve ser um booleano.');
    }

    if (!props.acceptedTerms) {
      throw new EntityError('O usuário deve aceitar os termos.');
    }

    if (props.gender && !Object.values(GENDER_TYPE).includes(props.gender)) {
      throw new EntityError('Gênero inválido.');
    }

    if (props.cpf && !Validations.validateCpf(props.cpf)) {
      throw new EntityError('CPF inválido.');
    }

    if (
      props.phoneNumber &&
      !Validations.validatePhoneNumber(props.phoneNumber)
    ) {
      throw new EntityError('Telefone inválido.');
    }

    // Atribuições
    this.userId = props.userId;
    this.name = props.name;
    this.nickname = props.nickname || props.name.split(' ')[0];
    this.username = props.username;
    this.email = props.email;
    this.role = props.role;
    this.acceptedTerms = props.acceptedTerms;
    this.acceptedTermsAt = props.acceptedTermsAt;
    this.dateBirth = props.dateBirth;
    this.gender = props.gender;
    this.cpf = props.cpf;
    this.biography = props.biography;
    this.phoneNumber = props.phoneNumber;
    this.createdAt = props.createdAt;
    this.updatedAt = props.updatedAt;
    this.linkInstagram = props.linkInstagram;
    this.linkTiktok = props.linkTiktok;
    this.backgroundPhoto = props.backgroundPhoto;
    this.profilePhoto = props.profilePhoto;
    this.isPrivate = props.isPrivate;
    this.followers = props.followers || [];
    this.following = props.following || [];
    this.favorites = props.favorites || [];
    this.reviewsId = props.reviewsId || [];
    this.searchHistory = props.searchHistory || [];
    this.presencesId = props.presencesId || [];
  }
}
