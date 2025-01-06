export type FinishSignUpReturnType = {
  email: string;
  newUsername: string;
  newNickname: string;
  acceptedTerms: string | undefined;
  role: string | undefined;
  name: string;
}