export enum ROLE_TYPE {
  OWNER = "OWNER",
  ORGANIZER = "ORGANIZER",
  MODERATOR = "MODERATOR",
  COMMON = "COMMON",
}

export function roleToEnum(value: string): ROLE_TYPE {
  switch (value) {
    case "OWNER":
      return ROLE_TYPE.OWNER;
    case "ORGANIZER":
      return ROLE_TYPE.ORGANIZER;
    case "MODERATOR":
      return ROLE_TYPE.MODERATOR;
    case "COMMON":
      return ROLE_TYPE.COMMON;
    default:
      return ROLE_TYPE.COMMON;
  }
}
