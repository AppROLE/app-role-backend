import { EntityError } from "src/shared/helpers/errors/errors";

export enum FEATURE {
  ESTACIONAMENTO = "ESTACIONAMENTO",
  FUMODROMO = "FUMODROMO",
  VALET = "VALET",
  AREA_ABERTA = "AREA_ABERTA",
  WELCOME_SHOT = "WELCOME_SHOT",
  MESAS = "MESAS",
  OPEN_BAR = "OPEN_BAR",
  AO_VIVO = "AO_VIVO",
  ESQUENTA = "ESQUENTA",
  AFTER = "AFTER",
}

export function toEnum(value: string): FEATURE {
  switch (value) {
    case "ESTACIONAMENTO":
      return FEATURE.ESTACIONAMENTO;
    case "FUMODROMO":
      return FEATURE.FUMODROMO;
    case "VALET":
      return FEATURE.VALET;
    case "AREA_ABERTA":
      return FEATURE.AREA_ABERTA;
    case "WELCOME_SHOT":
      return FEATURE.WELCOME_SHOT;
    case "MESAS":
      return FEATURE.MESAS;
    case "OPEN_BAR":
      return FEATURE.OPEN_BAR;
    case "AO_VIVO":
      return FEATURE.AO_VIVO;
    case "ESQUENTA":
      return FEATURE.ESQUENTA;
    case "AFTER":
      return FEATURE.AFTER;
    default:
      throw new EntityError("feature");
  }
}
