import { GENDER_TYPE } from "src/shared/domain/enums/gender_enum";
import { PRIVACY_TYPE } from "src/shared/domain/enums/privacy_enum";
import { ROLE_TYPE } from "src/shared/domain/enums/role_type_enum";

export class Validations {
  static validateUserId(userId: string): boolean {
    const USER_ID_LENGTH = 36;
    if (!userId || userId.length !== USER_ID_LENGTH) {
      return false;
    }
    return true;
  }

  static validateEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailRegex.test(email)) {
      return false;
    }
    return true;
  }

  static validateName(name: string): boolean {
    if (!name || name.trim().length === 0 || name.trim().length > 100) {
      return false;
    }
    return true;
  }

  static validateUsername(username: string): boolean {
    if (
      !username ||
      username.trim().length === 0 ||
      username.trim().length > 20 ||
      username !== username.toLowerCase()
    ) {
      return false;
    }
    return true;
  }

  static validateCpf(cpf?: string): boolean {
    if (cpf && cpf.trim().length > 14) {
      return false;
    }

    return true;
  }

  static validatePassword(password: string): boolean {
    // minimum 1 upper, 1 lower, 1 number, 1 special character, min 6 characters
    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&ç~{}#%&()\\`])[A-Za-z\d@$!%*?&]{6,}$/;
    if (!password || !passwordRegex.test(password)) {
      return false;
    }
    return true;
  }

  static validateRole(role?: ROLE_TYPE): boolean {
    if (role && !Object.values(ROLE_TYPE).includes(role)) {
      return false;
    }

    return true;
  }

  static validateGender(gender?: GENDER_TYPE): boolean {
    if (gender && !Object.values(GENDER_TYPE).includes(gender)) {
      return false;
    }

    return true;
  }

  static validateBiography(biography?: string): boolean {
    if (biography && biography.trim().length > 1000) {
      return false;
    }
    if (biography && biography.trim().length === 0) {
      return false;
    }

    return true;
  }

  static validatePhoneNumber(phoneNumber?: string): boolean {
    if (phoneNumber && phoneNumber.trim().length > 20) {
      return false;
    }
    return true;
  }

  static validateInstagram(linkInstagram?: string): boolean {
    if (linkInstagram && linkInstagram.trim().length > 255) {
      return false;
    }

    return true;
  }

  static validateTiktok(linkTiktok?: string): boolean {
    if (linkTiktok && linkTiktok.trim().length > 255) {
      return false;
    }

    return true;
  }

  static validateBackgroundPhoto(backgroundPhoto?: string): boolean {
    if (backgroundPhoto && backgroundPhoto.trim().length > 255) {
      return false;
    }

    return true;
  }

  static validateProfilePhoto(profilePhoto?: string): boolean {
    if (profilePhoto && profilePhoto.trim().length > 255) {
      return false;
    }
    return true;
  }

  static validatePrivacy(privacy?: PRIVACY_TYPE): boolean {
    if (!privacy || !Object.values(PRIVACY_TYPE).includes(privacy)) {
      return false;
    }

    return true;
  }


}
