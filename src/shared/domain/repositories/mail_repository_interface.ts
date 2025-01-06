export interface IMailRepository {
  sendMail(to: string, subject: string, body: string, code: string): Promise<void>;
}
