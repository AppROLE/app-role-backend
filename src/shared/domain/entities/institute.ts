import { INSTITUTE_TYPE, toEnum } from '../enums/institute_type_enum';
import { EntityError } from '../../helpers/errors/errors';
import { PARTNER_TYPE, toEnumPartnerType } from '../enums/partner_type_enum';
import { Address } from './address';

interface InstituteProps {
  instituteId: string;
  name: string;
  description: string;
  instituteType: INSTITUTE_TYPE;
  partnerType: PARTNER_TYPE;
  phone?: string;
  logo: string;
  address: Address;
  price?: number;
  eventsId: string[];
  reviewsId: string[];
  createdAt: number;
  updatedAt: number;
}

export class Institute {
  instituteId: string;
  name: string;
  logo: string;
  description: string;
  instituteType: INSTITUTE_TYPE;
  partnerType: PARTNER_TYPE;
  phone?: string;
  address: Address;
  price?: number;
  eventsId: string[];
  reviewsId: string[];
  createdAt: number;
  updatedAt: number;

  constructor(props: InstituteProps) {
    // Validações
    if (!props.instituteId || typeof props.instituteId !== 'string') {
      throw new EntityError(
        'ID do instituto é obrigatório e deve ser uma string'
      );
    }

    if (!props.name || props.name.trim().length < 3) {
      throw new EntityError('Nome deve conter pelo menos 3 caracteres');
    }

    if (!props.description || props.description.trim().length < 10) {
      throw new EntityError('Descrição deve conter pelo menos 10 caracteres');
    }

    if (!props.logo || typeof props.logo !== 'string') {
      throw new EntityError('Logo é obrigatório e deve ser uma string');
    }

    if (
      !props.instituteType ||
      !Object.values(INSTITUTE_TYPE).includes(props.instituteType)
    ) {
      throw new EntityError('Tipo de instituto inválido');
    }

    if (
      !props.partnerType ||
      !Object.values(PARTNER_TYPE).includes(props.partnerType)
    ) {
      throw new EntityError('Tipo de parceiro inválido');
    }

    if (props.phone && props.phone.trim().length < 8) {
      throw new EntityError('Telefone deve conter pelo menos 8 caracteres');
    }

    if (props.price !== undefined && (props.price < 1 || props.price > 5)) {
      throw new EntityError('O preço deve estar entre 1 e 5');
    }

    if (!props.address) {
      throw new EntityError('Endereço é obrigatório');
    }

    if (
      !Array.isArray(props.eventsId) ||
      props.eventsId.some((id) => typeof id !== 'string')
    ) {
      throw new EntityError(
        'A lista de eventos deve ser um array de strings válidas'
      );
    }

    if (
      !Array.isArray(props.reviewsId) ||
      props.reviewsId.some((id) => typeof id !== 'string')
    ) {
      throw new EntityError(
        'A lista de reviews deve ser um array de strings válidas'
      );
    }

    if (!props.createdAt || !props.updatedAt) {
      throw new EntityError(
        'As datas de criação e atualização são obrigatórias'
      );
    }

    // Atribuições
    this.instituteId = props.instituteId;
    this.name = props.name;
    this.logo = props.logo;
    this.description = props.description;
    this.instituteType = toEnum(props.instituteType);
    this.partnerType = toEnumPartnerType(props.partnerType);
    this.phone = props.phone;
    this.address = props.address;
    this.price = props.price;
    this.eventsId = props.eventsId;
    this.reviewsId = props.reviewsId || [];
    this.createdAt = props.createdAt;
    this.updatedAt = props.updatedAt;
  }
}
