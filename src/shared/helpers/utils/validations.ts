import { ROLE_TYPE } from "src/shared/domain/enums/role_type_enum";

export class Validations {
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

  static validaterole(role?: ROLE_TYPE): boolean {
    if (role && !Object.values(ROLE_TYPE).includes(role)) {
      return false;
    }

    return true;
  }
}
