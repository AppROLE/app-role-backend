import { User } from "../entities/user";
import { ROLE_TYPE } from "../enums/role_type_enum";

export interface IAuthRepository {
  signUp(
    name: string,
    email: string,
    password: string,
    role: ROLE_TYPE
  ): Promise<User>;
  signIn(
    email: string,
    password: string
  ): Promise<{
    accessToken: string;
    idToken: string;
    refreshToken: string;
  }>;
  resendCode(email: string): Promise<string>;
  getUserByEmail(email: string): Promise<User | undefined>;
  refreshToken(refreshToken: string): Promise<{
    accessToken: string;
    idToken: string;
    refreshToken: string;
  }>;
  forgotPassword(email: string): Promise<string>;
  confirmForgotPassword(
    email: string,
    newPassword: string,
    code: string
  ): Promise<void>;
  deleteAccount(username: string, password: string): Promise<void>;
  adminUpdateUser(email: string, newRole: string): Promise<void>;
}
