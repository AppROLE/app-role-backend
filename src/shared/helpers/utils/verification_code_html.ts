export const verificationCodeHtml = (code: string) => `
<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Nunito:ital,wght@0,200..1000;1,200..1000&display=swap" rel="stylesheet">
  <style>
    body {
      font-family: Nunito, sans-serif;
      margin: 0;
      padding: 0;
      background-color: #1C1C1C;
      color: #ffffff;
    }
    .email-container {
      width: 100%;
      max-width: 600px;
      margin: 0 auto;
      background-color: #2c2c2c;
      padding: 40px 10px 10px;
      border-radius: 20px;
      box-shadow: 0 0 10px rgba(0, 0, 0, 0.3);
      text-align: center;
      margin-top: 96px;
    }
    .header {
      font-size: 28px;
      color: #ffffff;
      font-weight: bold;
      margin-bottom: 32px;
    }
    .content {
      font-size: 18px;
      color: #dddddd;
    }
    .verification-code-container {
      display: inline-block;
      font-size: 20px;
      color: #DFA9FD;
      font-weight: bold;
      background-color: #444444;
      padding: 0px 16px;
      border-radius: 20px;
      margin-top: 32px;
      margin-bottom: 32px;
      white-space: nowrap;
      box-shadow: 0 0 10px rgba(0, 0, 0, 0.3);
    }
    .verification-code {
      font-size: 32px;
      line-height: 0;
      color: #DFA9FD;
      font-weight: bold;
      white-space: nowrap;
      letter-spacing: 25px;
      margin-right:-25px;
    }
    .footer {
      font-size: 14px;
      color: #bbbbbb; /* Cinza claro */
      text-align: center;
      margin-top: 30px;
      margin-bottom: 16px;
    }
  </style>
</head>
<body>
  <div class="email-container">
    <div class="header">Código de Verificação</div>
    <div class="content">
      Olá! Use o código abaixo para verificar sua conta:
    </div>
    <div class="verification-code-container">
    <p class="verification-code">${code}</p>
    </div>
    <div class="content">
      Se você não solicitou este código, por favor ignore este email.
    </div>
    <div class="footer">
      © ROLE, Todos os direitos reservados.
    </div>
  </div>
</body>
</html>

`