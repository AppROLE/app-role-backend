export interface IAuthRepository {
  signUp(
    name: string,
    email: string,
    password: string
  ): Promise<{
    userId: string;
    name: string;
    email: string;
    role: string;
  }>;
  signIn(
    email: string,
    password: string
  ): Promise<{
    accessToken: string;
    idToken: string;
    refreshToken: string;
  }>;
  resendCode(email: string): Promise<string>;
  getUserByEmail(email: string): Promise<
    | {
        userId: string;
        email: string;
        name: string;
        username: string;
        role: string;
        emailVerified: boolean;
      }
    | undefined
  >;
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
