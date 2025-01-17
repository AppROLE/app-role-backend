export const accountDeletionEmailBody = (name: string) => `
<!doctype html>
<html lang="pt-BR">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <link
      href="https://fonts.googleapis.com/css2?family=Nunito:wght@400;700&display=swap"
      rel="stylesheet"
    />
    <style>
      body {
        font-family: 'Nunito', sans-serif;
        margin: 0;
        padding: 0;
        background-color: #1c1c1c;
        color: #ffffff;
      }
      .email-container {
        width: 100%;
        max-width: 600px;
        margin: 0 auto;
        background-color: #2c2c2c;
        padding: 40px 20px;
        border-radius: 20px;
        box-shadow: 0 0 10px rgba(0, 0, 0, 0.3);
        text-align: center;
        margin-top: 96px;
        border: 1px solid #696969;
      }
      .email-logo {
        max-width: 100%;
        width: 120px;
        height: auto;
        margin-bottom: 12px;
      }
      .header {
        font-size: 24px;
        font-weight: bold;
        color: #ffffff;
      }
      .content {
        font-size: 16px;
        color: #dddddd;
        margin: 20px 0;
      }
      .footer {
        font-size: 12px;
        color: #bbbbbb;
        margin-top: 20px;
      }
    </style>
  </head>
  <body>
    <div class="email-container">
      <img
        src="https://approle-assets.s3.sa-east-1.amazonaws.com/email_logo.png"
        width="640"
        height="360"
        class="email-logo"
      />
      <div class="header">Conta Deletada</div>
      <div class="content">
        Olá, ${name}! <br /><br />
        Confirmamos que sua conta foi deletada com sucesso. Sentiremos sua falta na comunidade.
      </div>
      <div class="content">
        Como parte do processo, todos os seus dados pessoais foram removidos de forma segura, respeitando a sua privacidade e nossas políticas de proteção de informações.
      </div>
      <div class="content">
        Se mudar de ideia, estamos sempre de braços abertos para recebê-lo de volta. Será um prazer tê-lo novamente conosco!
      </div>
      <div class="footer">&copy; 2025 ROLE, Todos os direitos reservados.</div>
    </div>
  </body>
</html>`;
