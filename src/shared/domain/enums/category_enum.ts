import { EntityError } from "src/shared/helpers/errors/errors";

export enum CATEGORY {
  BALADA = "BALADA",
  UNIVERSITARIO = "UNIVERSITARIO",
  BAR = "BAR",
  BAR_BALADA = "BAR_BALADA",
  SHOW = "SHOW",
  FESTIVAL = "FESTIVAL",
  FESTA = "FESTA",
}

export function toEnum(value: string): CATEGORY {
  switch (value) {
    case "BALADA":
      return CATEGORY.BALADA;
    case "UNIVERSITARIO":
      return CATEGORY.UNIVERSITARIO;
    case "BAR":
      return CATEGORY.BAR;
    case "BAR_BALADA":
      return CATEGORY.BAR_BALADA;
    case "SHOW":
      return CATEGORY.SHOW;
    case "FESTIVAL":
      return CATEGORY.FESTIVAL;
    case "FESTA":
      return CATEGORY.FESTA;
    default:
      throw new EntityError("category");
  }
}
