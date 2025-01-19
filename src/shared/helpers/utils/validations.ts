import { GENDER_TYPE } from 'src/shared/domain/enums/gender_enum';
import { ROLE_TYPE } from 'src/shared/domain/enums/role_type_enum';

export class Validations {
  static validateUserId(userId: string): boolean {
    const USER_ID_LENGTH = 36;
    if (!userId || userId.length !== USER_ID_LENGTH) {
      return false;
    }
    return true;
  }

  static validateEmail(email: string): boolean {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+.[a-zA-Z]{2,}$/;
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

  static validateCpf(cpf?: string): boolean {
    if (cpf && cpf.trim().length > 14) {
      return false;
    }

    return true;
  }

  static validateCode(code: string): boolean {
    if (code.trim().length !== 6) {
      return false;
    }

    return true;
  }

  static validatePassword(password: string): boolean {
    // Regex que valida a senha com os requisitos:
    // Pelo menos 1 número
    // Pelo menos 1 caractere especial (incluso os mencionados na descrição)
    // Pelo menos 1 letra maiúscula
    // Pelo menos 1 letra minúscula
    const passwordRegex =
      /^(?=.*[0-9])(?=.*[!@#$%^&*()[\]{}:;'",.<>?|_~`+\-=\\/ ])(?=.*[A-Z])(?=.*[a-z]).{1,}$/;

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

  static validateUsername(username?: string): boolean {
    const usernameRegex = /^[a-z0-9._]+$/;
    if (
      !username ||
      username.trim().length < 3 ||
      username.trim().length > 20 ||
      !usernameRegex.test(username)
    ) {
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

  static validateIsPrivate(isPrivate?: boolean): boolean {
    if (isPrivate === undefined || isPrivate === null) {
      return false;
    }

    return true;
  }
}
