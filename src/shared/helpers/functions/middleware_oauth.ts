import { ForbiddenAction } from "../errors/errors";

export async function middlewareOAuth(accessToken: string) {
  try {
    const response = await fetch(
      "https://www.googleapis.com/oauth2/v1/userinfo?alt=json",
      {
        headers: { Authorization: `Bearer ${accessToken}` },
      }
    );

    if (!response.ok) {
      throw new ForbiddenAction("usuário: token inválido");
    }

    const userInfo = await response.json();

    return userInfo.email;
  } catch (error: any) {
    throw new ForbiddenAction("usuário: token inválido");
  }
}
