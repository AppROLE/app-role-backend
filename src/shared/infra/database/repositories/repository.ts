import mongoose, { Connection } from "mongoose";
import { IEventRepository } from "src/shared/domain/repositories/event_repository_interface";
import { Environments, STAGE } from "src/shared/environments";
import { EventRepositoryMock } from "../../mocks/event_repository_mock";
import { EventRepositoryMongo } from "./event_repository_mongo";
import { DatabaseException } from "src/shared/helpers/errors/base_error";
import { IInstituteRepository } from "src/shared/domain/repositories/institute_repository_interface";
import { IPresenceRepository } from "src/shared/domain/repositories/presence_repository_interface";
import { InstituteRepositoryMongo } from "./institute_repository_mongo";
import { PresenceRepositoryMongo } from "./presence_repository_mongo";
import { IFileRepository } from "src/shared/domain/repositories/file_repository_interface";
import { FileRepositoryS3 } from "./file_repository_s3";
import { IUserRepository } from "src/shared/domain/repositories/user_repository_interface";
import { UserRepositoryMongo } from "./user_repository_mongo";

interface RepositoryConfig {
  event_repo?: boolean;
  institute_repo?: boolean;
  presence_repo?: boolean;
  user_repo?: boolean;
  file_repo?: boolean;
}

export class Repository {
  event_repo?: IEventRepository;
  institute_repo?: IInstituteRepository;
  presence_repo?: IPresenceRepository;
  user_repo?: IUserRepository;
  file_repo?: IFileRepository;
  private connection: Connection | null = null;

  constructor({
    event_repo = false,
    institute_repo = false,
    presence_repo = false,
    user_repo = false,
    file_repo = false,
  }: RepositoryConfig) {
    console.log("STAGE: " + Environments.stage)
    if (Environments.stage === STAGE.TEST) {
      this._initializeMockRepositories(
        event_repo,
        institute_repo,
        presence_repo,
        user_repo,
        file_repo
      );
    } else {
      this._initializeDatabaseRepositories(
        event_repo,
        institute_repo,
        presence_repo,
        user_repo,
        file_repo
      );
    }
    console.log("usecase: ", this)
  }

  private _initializeMockRepositories(
    event_repo: boolean = false,
    institute_repo: boolean = false,
    presence_repo: boolean = false,
    user_repo: boolean = false,
    file_repo: boolean = false
  ): void {
    if (event_repo) {
      this.event_repo = new EventRepositoryMock();
    }
  }

  private async _initializeDatabaseRepositories(
    event_repo: boolean = false,
    institute_repo: boolean = false,
    presence_repo: boolean = false,
    user_repo: boolean = false,
    file_repo: boolean = false
  ): Promise<void> {
    this.connection = await this.__connectDb();
    if (event_repo) {
      this.event_repo = new EventRepositoryMongo(this.connection);
    }
    if (institute_repo) {
      this.institute_repo = new InstituteRepositoryMongo(this.connection);
    }
    if (presence_repo) {
      this.presence_repo = new PresenceRepositoryMongo(this.connection);
    }
    if (user_repo) {
      this.user_repo = new UserRepositoryMongo(this.connection);
    }
    if (file_repo) {
      this.file_repo = new FileRepositoryS3();
    }
  }

  private async __connectDb(): Promise<Connection> {
    try {
      await mongoose.connect(Environments.dbUrl);
      console.log("✅ Conexão com MongoDB estabelecida com sucesso.");
      return mongoose.connection;
    } catch (error) {
      throw new DatabaseException(`${error}`);
    }
  }

  public async closeSession(): Promise<void> {
    if (this.connection) {
      await this.connection.close();
      this.connection = null;
      console.log("🛑 Conexão com MongoDB encerrada.");
    }
  }
}
