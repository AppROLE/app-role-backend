import { SESClient, SendEmailCommand } from '@aws-sdk/client-ses';
import {
  EmailOptions,
  IEmailRepository,
} from 'src/shared/domain/repositories/email_interface';
import { Environments } from 'src/shared/environments';

export class EmailSESRepository implements IEmailRepository {
  private sesClient: SESClient;

  constructor() {
    this.sesClient = new SESClient({ region: Environments.region });
  }

  async sendEmail(options: EmailOptions): Promise<void> {
    const params = {
      Source: 'contato@theplaza.cc',
      Destination: {
        ToAddresses: [options.to],
      },
      Message: {
        Subject: {
          Data: options.subject,
        },
        Body: {
          Html: {
            Data: options.body, // Enviando o corpo como HTML
          },
        },
      },
    };

    const command = new SendEmailCommand(params);

    try {
      await this.sesClient.send(command);
    } catch (error) {
      console.log('Erro ao enviar o email:', (error as Error).message || error);
    }
  }
}
