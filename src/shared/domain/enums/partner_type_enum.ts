import { EntityError } from 'src/shared/helpers/errors/errors';

export enum PARTNER_TYPE {
  GLOBAL_PARTNER = 'GLOBAL_PARTNER',
  PROMOTER_PARTNER = 'PROMOTER_PARTNER',
  NO_PARTNER = 'NO_PARTNER',
}

export function toEnumPartnerType(partnerType: string) {
  switch (partnerType) {
    case 'GLOBAL_PARTNER':
      return PARTNER_TYPE.GLOBAL_PARTNER;
    case 'PROMOTER_PARTNER':
      return PARTNER_TYPE.PROMOTER_PARTNER;
    case 'NO_PARTNER':
      return PARTNER_TYPE.NO_PARTNER;
    default:
      throw new EntityError('partner type');
  }
}
