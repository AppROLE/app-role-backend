export enum USER_STATUS {
  UNCONFIRMED = "UNCONFIRMED",
  CONFIRMED = "CONFIRMED",
  ARCHIVED = "ARCHIVED",
  UNKNOWN = "UNKNOWN",
  RESET_REQUIRED = "RESET_REQUIRED",
  FORCE_CHANGE_PASSWORD = "FORCE_CHANGE_PASSWORD",
}

export function userStatusToEnum(value: string): USER_STATUS {
  switch (value) {
    case "UNCONFIRMED":
      return USER_STATUS.UNCONFIRMED;
    case "CONFIRMED":
      return USER_STATUS.CONFIRMED;
    case "ARCHIVED":
      return USER_STATUS.ARCHIVED;
    case "UNKNOWN":
      return USER_STATUS.UNKNOWN;
    case "RESET_REQUIRED":
      return USER_STATUS.RESET_REQUIRED;
    case "FORCE_CHANGE_PASSWORD":
      return USER_STATUS.FORCE_CHANGE_PASSWORD;
    default:
      return USER_STATUS.UNKNOWN;
  }
}
