import { EntityError } from "src/shared/helpers/errors/errors";

export enum PACKAGE_TYPE {
  COMBO = "COMBO",
  ANIVERSARIO = "ANIVERSARIO",
  CAMAROTE = "CAMAROTE",
}

export function toEnum(value: string): PACKAGE_TYPE {
  switch (value) {
    case "COMBO":
      return PACKAGE_TYPE.COMBO;
    case "ANIVERSARIO":
      return PACKAGE_TYPE.ANIVERSARIO;
    case "CAMAROTE":
      return PACKAGE_TYPE.CAMAROTE;
    default:
      throw new EntityError("package type");
  }
}
