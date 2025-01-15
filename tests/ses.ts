import { SESClient, SendEmailCommand } from '@aws-sdk/client-ses';

import { config } from 'dotenv';
import path from 'path';
config({ path: path.resolve(__dirname, '../.env') });

async function ses() {
  const sesClient = new SESClient({ region: process.env.AWS_REGION });

  const params = {
    Source: 'contato@theplaza.cc',
    Destination: {
      ToAddresses: ['contato@theplaza.cc'],
    },
    Message: {
      Subject: {
        Data: 'teste',
      },
      Body: {
        Text: {
          Data: 'test',
        },
      },
    },
  };

  const command = new SendEmailCommand(params);
  const result = await sesClient.send(command);

  console.log(result);
}

ses();
