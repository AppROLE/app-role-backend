import { EntityError } from '../../helpers/errors/errors';
import { STATUS } from '../../domain/enums/status_enum';
import { FEATURE } from '../enums/feature_enum';
import { CATEGORY } from '../enums/category_enum';
import { PACKAGE_TYPE } from '../enums/package_type_enum';
import { AGE_ENUM } from '../enums/age_enum';
import { Address } from './address';
import { MUSIC_TYPE } from '../enums/music_type_enum';

interface EventProps {
  eventId: string;
  name: string;
  description: string;
  address: Address;
  price: number;
  ageRange: AGE_ENUM;
  eventDate: number; // timestamp
  instituteId: string;
  eventStatus: STATUS;
  musicType: MUSIC_TYPE[];
  menuLink?: string;
  eventPhoto: string;
  galleryLink: string[];
  packageType: PACKAGE_TYPE[];
  category?: CATEGORY;
  ticketUrl?: string;
  features: FEATURE[];
  presencesId: string[];
  createdAt: number;
  updatedAt: number;
}

export class Event {
  eventId: string;
  name: string;
  description: string;
  address: Address;
  price: number;
  ageRange: AGE_ENUM;
  eventDate: number;
  instituteId: string;
  eventStatus: STATUS;
  musicType: MUSIC_TYPE[];
  menuLink?: string;
  eventPhoto: string;
  galleryLink: string[];
  packageType: PACKAGE_TYPE[];
  category?: CATEGORY;
  ticketUrl?: string;
  features: FEATURE[];
  presencesId: string[];
  createdAt: number;
  updatedAt: number;

  constructor(props: EventProps) {
    // Validações
    if (!props.eventId || typeof props.eventId !== 'string') {
      throw new EntityError('ID do evento é obrigatório e deve ser uma string');
    }

    if (!props.name || props.name.trim().length < 3) {
      throw new EntityError(
        'Nome do evento deve conter pelo menos 3 caracteres'
      );
    }

    if (!props.description || props.description.trim().length < 10) {
      throw new EntityError(
        'Descrição do evento deve conter pelo menos 10 caracteres'
      );
    }

    if (!(props.price >= 1 && props.price <= 5)) {
      throw new EntityError('O preço do evento deve ser entre 1 e 5');
    }

    if (!props.eventDate) {
      throw new EntityError('Data do evento é obrigatório');
    }

    if (!props.instituteId || typeof props.instituteId !== 'string') {
      throw new EntityError(
        'ID do instituto é obrigatório e deve ser uma string'
      );
    }

    if (!Object.values(STATUS).includes(props.eventStatus)) {
      throw new EntityError('Status do evento inválido');
    }

    if (
      !props.musicType ||
      !Array.isArray(props.musicType) ||
      props.musicType.length === 0
    ) {
      throw new EntityError(
        'Tipo de música é obrigatório e deve ser uma lista válida'
      );
    }

    if (!props.address) {
      throw new EntityError('Endereço do evento é obrigatório');
    }

    if (!props.eventPhoto || typeof props.eventPhoto !== 'string') {
      throw new EntityError(
        'Foto do evento é obrigatória e deve ser uma string'
      );
    }

    if (!Array.isArray(props.galleryLink)) {
      throw new EntityError('A galeria deve ser uma lista de links');
    }

    if (!Array.isArray(props.packageType)) {
      throw new EntityError('Os tipos de pacotes devem ser uma lista');
    }

    if (!Array.isArray(props.features)) {
      throw new EntityError('As características do evento devem ser uma lista');
    }

    if (!Array.isArray(props.presencesId)) {
      throw new EntityError(
        'Os IDs de presença devem ser uma lista de strings'
      );
    }

    if (!props.createdAt || !props.updatedAt) {
      throw new EntityError(
        'As datas de criação e atualização são obrigatórias'
      );
    }

    // Atribuições
    this.eventId = props.eventId;
    this.name = props.name;
    this.description = props.description;
    this.address = props.address;
    this.price = props.price;
    this.ageRange = props.ageRange;
    this.eventDate = props.eventDate;
    this.instituteId = props.instituteId;
    this.eventStatus = props.eventStatus;
    this.musicType = props.musicType;
    this.menuLink = props.menuLink;
    this.eventPhoto = props.eventPhoto;
    this.galleryLink = props.galleryLink;
    this.packageType = props.packageType;
    this.category = props.category;
    this.ticketUrl = props.ticketUrl;
    this.features = props.features;
    this.presencesId = props.presencesId;
    this.createdAt = props.createdAt;
    this.updatedAt = props.updatedAt;
  }
}
