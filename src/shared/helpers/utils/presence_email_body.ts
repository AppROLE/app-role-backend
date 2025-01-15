export const presenceEmailBody = (username: string, eventName: string) => `
<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <link href="https://fonts.googleapis.com/css2?family=Nunito:wght@400;700&display=swap" rel="stylesheet">
  <style>
    body {
      font-family: 'Nunito', sans-serif;
      margin: 0;
      padding: 0;
      background-color: #1C1C1C;
      color: #ffffff;
    }
    .email-container {
      max-width: 600px;
      margin: 0 auto;
      background-color: #2C2C2C;
      padding: 40px 20px;
      border-radius: 8px;
      text-align: center;
      box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
    }
    .header {
      font-size: 24px;
      font-weight: bold;
      color: #FFFFFF;
    }
    .content {
      font-size: 16px;
      color: #DDDDDD;
      margin: 20px 0;
    }
    .footer {
      font-size: 12px;
      color: #BBBBBB;
      margin-top: 20px;
    }
  </style>
</head>
<body>
  <div class="email-container">
    <div class="header">Presença Confirmada</div>
    <div class="content">
      Olá, ${username}! Sua presença no evento <strong>${eventName}</strong> foi confirmada com sucesso.
    </div>
    <div class="content">
      Obrigado por participar! Estamos ansiosos para vê-lo lá.
    </div>
    <div class="footer">
      &copy; 2025 ROLE, Todos os direitos reservados.
    </div>
  </div>
</body>
</html>`;
