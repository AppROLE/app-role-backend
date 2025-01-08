export class BaseError extends Error {
  private readonly _message: string;

  constructor(message: string) {
    super(message);
    this._message = message;

    this.logError();
  }

  get message(): string {
    return this._message;
  }

  private logError(): void {
    console.error(
      `🛑 [${new Date().toISOString()}]: ${this.constructor.name} - ${
        this._message
      }`
    );
  }
}

export class MissingParameters extends BaseError {
  constructor(message: string) {
    super(`O campo ${message} está faltando.`);
  }
}

export class EntityError extends BaseError {
  constructor(message: string) {
    super(`O campo ${message} não é válido.`);
  }
}

export class WrongTypeParameters extends BaseError {
  constructor(
    fieldName: string,
    fieldTypeExpected: string,
    fieldTypeReceived: string
  ) {
    super(
      `O campo ${fieldName} não possui o tipo correto.\n Recebido: ${fieldTypeReceived}.\n Experado: ${fieldTypeExpected}.`
    );
  }
}

export class NoItemsFound extends BaseError {
  constructor(message: string) {
    super(`Nenhum item foi encontrado para ${message}`);
  }
}

export class DuplicatedItem extends BaseError {
  constructor(message: string) {
    super(`Item já existente para ${message}`);
  }
}

export class ForbiddenAction extends BaseError {
  constructor(message: string) {
    super(`Esta ação não é permitida para este ${message}`);
  }
}

export class ConflictItems extends BaseError {
  constructor(message: string) {
    super(`Conflict items for ${message}`);
  }
}

export class FailToSendEmail extends BaseError {
  constructor(message: string) {
    super(`Falha ao enviar o email ${message}`);
  }
}

export class FailedToAddToGallery extends BaseError {
  constructor() {
    super("Você atingiu o limite de fotos na galeria");
  }
}

export class UserAlreadyConfirmedEvent extends BaseError {
  constructor() {
    super("Usuário já confirmou presença neste evento");
  }
}

export class UserAlreadyExists extends BaseError {
  constructor() {
    super("Este usuário já está cadastrado");
  }
}

export class UserNotRegistered extends BaseError {
  constructor() {
    super("Usuário não cadastrado ainda");
  }
}

export class UserNotConfirmed extends BaseError {
  constructor() {
    super("Usuário não confirmado ainda");
  }
}

export class UserSignUpNotFinished extends BaseError {
  constructor() {
    super("Usuário não finalizou o cadastro ainda");
  }
}

export class RequestUserToForgotPassword extends BaseError {
  constructor() {
    super("Redefina sua senha com o esqueci minha senha");
  }
}

export class FollowMeConflict extends BaseError {
  constructor() {
    super("Você não pode seguir a si mesmo");
  }
}

export class CognitoError extends BaseError {
  constructor(message: string) {
    super(`Erro com o Cognito: ${message}`);
  }
}


export class PasswordDoesNotMatchError extends BaseError {
  constructor() {
    super("Password does not match");
  }
}

export class InvalidCredentialsError extends BaseError {
  constructor() {
    super("Credenciais inválidas");
  }
}

export class DatabaseException extends BaseError {
  constructor(message: string) {
    super(`Erro ao conectar com o MongoDB: ${message}`);
  }
}

export class S3Exception extends BaseError {
  constructor(message: string) {
    super(`S3 Error: ${message}`);
  }
}
