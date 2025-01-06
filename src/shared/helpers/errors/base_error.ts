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
