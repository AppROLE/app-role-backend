import { ConfirmSignUpCommandOutput } from '@aws-sdk/client-cognito-identity-provider';
import { User } from '../entities/user';
import { ROLE_TYPE } from '../enums/role_type_enum';

export interface IAuthRepository {
  signUp(
    name: string,
    email: string,
    password: string,
    role: ROLE_TYPE
  ): Promise<void>;
  signIn(
    email: string,
    password: string
  ): Promise<{
    accessToken: string;
    idToken: string;
    refreshToken: string;
  }>;
  resendCode(email: string): Promise<void>;
  confirmCode(email: string, code: string): Promise<ConfirmSignUpCommandOutput>;
  getUserByEmail(email: string): Promise<User | null>;
  forgotPassword(email: string): Promise<void>;
  confirmForgotPassword(
    email: string,
    newPassword: string,
    code: string
  ): Promise<void>;
  deleteAccount(username: string, password: string): Promise<void>;
  adminUpdateUser(email: string, newRole: string): Promise<void>;
  refreshToken(refreshToken: string): Promise<{
    accessToken: string;
    idToken: string;
    refreshToken: string;
  }>;
  updateUser(email: string, newUsername?: string): Promise<void>;
  disableUser(email: string): Promise<void>;
  enableUser(email: string): Promise<void>;
}
