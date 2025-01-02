export class BaseError extends Error {
  private readonly _message: string;

  constructor(message: string) {
    super(message);
    this._message = message;
  }

  get message(): string {
    return this._message;
  }
}

export class DatabaseException extends BaseError {
  constructor(message: string) {
    super(`Erro ao conectar com o MongoDB: ${message}`);
  }
}
