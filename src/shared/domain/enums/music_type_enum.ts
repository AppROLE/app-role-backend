import { EntityError } from "src/shared/helpers/errors/errors";

export enum MUSIC_TYPE {
    FUNK = "FUNK",
    SERTANEJO = "SERTANEJO",
    TRAP = "TRAP",
    ELETRONICA = "ELETRONICA",
    PAGODE = "PAGODE",
    ROCK = "ROCK",
    POP = "POP",
    RAP = "RAP",
    REGGAE = "REGGAE",
    FORRO = "FORRO",
    MPB = "MPB",
  }
  
  export function toEnum(value: string): MUSIC_TYPE {
    switch (value) {
      case "FUNK":
        return MUSIC_TYPE.FUNK;
      case "SERTANEJO":
        return MUSIC_TYPE.SERTANEJO;
      case "TRAP":
        return MUSIC_TYPE.TRAP;
      case "ELETRONICA":
        return MUSIC_TYPE.ELETRONICA;
      case "PAGODE":
        return MUSIC_TYPE.PAGODE;
      case "ROCK":
        return MUSIC_TYPE.ROCK;
      case "POP":
        return MUSIC_TYPE.POP;
      case "RAP":
        return MUSIC_TYPE.RAP;
      case "REGGAE":
        return MUSIC_TYPE.REGGAE;
      case "FORRO":
        return MUSIC_TYPE.FORRO;
      case "MPB":
        return MUSIC_TYPE.MPB;
      default:
        throw new EntityError("music type");
    }
  }
  