import { EntityError } from "src/shared/helpers/errors/errors";

export enum PRIVACY_TYPE {
  PUBLIC = "PUBLIC",
  PRIVATE = "PRIVATE",
}

export function toEnum(value: string): PRIVACY_TYPE {
  switch (value) {
    case "PUBLIC":
      return PRIVACY_TYPE.PUBLIC;
    case "PRIVATE":
      return PRIVACY_TYPE.PRIVATE;
    default:
      throw new EntityError("privacy type");
  }
}