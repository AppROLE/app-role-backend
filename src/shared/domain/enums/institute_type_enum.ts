import { EntityError } from 'src/shared/helpers/errors/errors';

export enum INSTITUTE_TYPE {
  ESTABELECIMENTO_FIXO = 'ESTABELECIMENTO_FIXO',
  AGENCIA_DE_FESTAS = 'AGENCIA_DE_FESTAS',
}

export function toEnum(value: string): INSTITUTE_TYPE {
  switch (value) {
    case 'ESTABELECIMENTO_FIXO':
      return INSTITUTE_TYPE.ESTABELECIMENTO_FIXO;
    case 'AGENCIA_DE_FESTAS':
      return INSTITUTE_TYPE.AGENCIA_DE_FESTAS;
    default:
      throw new EntityError('institute type');
  }
}
