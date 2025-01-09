import { EntityError } from 'src/shared/helpers/errors/errors';

export enum GENDER_TYPE {
  MALE = 'MALE',
  FEMALE = 'FEMALE',
  OTHER = 'OTHER',
}

export function toEnum(value: string): GENDER_TYPE {
  switch (value) {
    case 'MALE':
      return GENDER_TYPE.MALE;
    case 'FEMALE':
      return GENDER_TYPE.FEMALE;
    case 'OTHER':
      return GENDER_TYPE.OTHER;
    default:
      throw new EntityError('gender type');
  }
}
