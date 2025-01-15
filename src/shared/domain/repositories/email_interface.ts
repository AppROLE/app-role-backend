export interface EmailOptions {
  to: string;
  subject: string;
  body: string;
}

export interface IEmailRepository {
  sendEmail(options: EmailOptions): Promise<void>;
}
