import { EntityError } from "src/shared/helpers/errors/domain_errors";

export enum GENDER_TYPE {
  MALE = "Masculino",
  FEMALE = "Feminino",
  OTHER = "Outro",
}

export function toEnum(value: string): GENDER_TYPE {
  switch (value) {
    case "Masculino":
      return GENDER_TYPE.MALE
    case "Feminino":
      return GENDER_TYPE.FEMALE
    case "Outro":
      return GENDER_TYPE.OTHER
    default:
      throw new EntityError("gênero")
  }
}