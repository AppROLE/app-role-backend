import {
  CognitoIdentityProviderClient,
  AdminGetUserCommand,
} from "@aws-sdk/client-cognito-identity-provider";
import { UserCognitoDTO } from "../src/shared/infra/dto/user_cognito_dto";

// ⚙️ **Configuração do Cognito**
const cognitoClient = new CognitoIdentityProviderClient({
  region: "sa-east-1",
  credentials: {
    accessKeyId: ,
    secretAccessKey: ,
  },
});

// 📚 **Função para buscar um usuário real do Cognito**
async function getUserFromCognito(username: string, userPoolId: string) {
  try {
    console.log(`🔄 Buscando dados do usuário '${username}' no Cognito...`);

    const command = new AdminGetUserCommand({
      UserPoolId: userPoolId,
      Username: username,
    });

    const response = await cognitoClient.send(command);

    console.log("✅ Resposta do Cognito obtida com sucesso!");
    console.log(response);

    const userDTO = UserCognitoDTO.fromCognito(response);
    console.log("✅ DTO convertido com sucesso:");
    console.log(userDTO);
    console.log(typeof userDTO.role);

    return userDTO;
  } catch (error) {
    console.error("❌ Erro ao buscar usuário no Cognito:", error);
    throw error;
  }
}

// 🚀 **Função de Teste**
async function testCognitoUser() {
  const username = "teste@teste.com"; // Substitua pelo nome de usuário válido
  const userPoolId = ;

  try {
    const userDTO = await getUserFromCognito(username, userPoolId);

    // Validações Básicas
    console.assert(userDTO.email !== undefined, "Erro: Email não encontrado");
    console.assert(userDTO.username === username, "Erro: Username incorreto");
    console.assert(userDTO.enabled === true, "Erro: Usuário desabilitado");
    console.assert(
      userDTO.emailVerified === true,
      "Erro: Email não verificado"
    );

    console.log("✅ Todos os testes passaram com sucesso!");
  } catch (error) {
    console.error("❌ Teste falhou:", error);
  }
}

// Executa o teste
testCognitoUser();
