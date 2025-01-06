// import nodemailer, { SendMailOptions } from "nodemailer";
// import { IMailRepository } from "../../../domain/repositories/mail_repository_interface";
// import { FailToSendEmail } from "../../../helpers/errors/usecase_errors";
// import { InvalidCredentialsError } from "../../../helpers/errors/login_errors";
// import { verificationCodeHtml } from "src/shared/utils/verification_code_html";

// const transporter = nodemailer.createTransport({
//   host: "smtp.zoho.com",
//   port: 465,
//   secure: true,
//   auth: {
//     user: envs.EMAIL_LOGIN,
//     pass: envs.EMAIL_PASSWORD,
//   },
// });

// export class MailRepository implements IMailRepository {
//   /**
//    * Sends an email to the specified recipient with the given subject and text.
//    * @param to The email address of the recipient.
//    * @param subject The subject of the email.
//    * @param text The content of the email.
//    * @returns A promise that resolves when the email is successfully sent.
//    * @throws {InvalidCredentialsError} If the email login or password is missing.
//    * @throws {FailToSendEmail} If there is an error while sending the email.
//    */
//   async sendMail(
//     to: string,
//     subject: string,
//     body: string,
//     code: string
//   ): Promise<void> {
//     if (!envs.EMAIL_LOGIN || !envs.EMAIL_PASSWORD) {
//       throw new InvalidCredentialsError();
//     }

//     const mailOptions: SendMailOptions = {
//       from: envs.EMAIL_LOGIN,
//       to,
//       subject,
//       text: body,
//       html: verificationCodeHtml(code),
//     };

//     try {
//       const info = await transporter.sendMail(mailOptions);
//       console.log(`E-mail enviado para ${to}: ${info.response}`);
//     } catch (error: any) {
//       console.error(`Erro ao enviar e-mail para ${to}: ${error}`);
//       throw new FailToSendEmail(`para ${to}, erro: ${error}`);
//     }
//   }
// }
