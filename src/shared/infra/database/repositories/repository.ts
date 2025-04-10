import mongoose, { Connection } from 'mongoose';
import { IEventRepository } from 'src/shared/domain/repositories/event_repository_interface';
import { Environments, STAGE } from 'src/shared/environments';
import { EventRepositoryMongo } from './event_repository_mongo';
import { DatabaseException } from 'src/shared/helpers/errors/errors';
import { IInstituteRepository } from 'src/shared/domain/repositories/institute_repository_interface';
import { IPresenceRepository } from 'src/shared/domain/repositories/presence_repository_interface';
import { InstituteRepositoryMongo } from './institute_repository_mongo';
import { PresenceRepositoryMongo } from './presence_repository_mongo';
import { IFileRepository } from 'src/shared/domain/repositories/file_repository_interface';
import { FileRepositoryS3 } from './file_repository_s3';
import { IProfileRepository } from 'src/shared/domain/repositories/profile_repository_interface';
import { ProfileRepositoryMongo } from './profile_repository_mongo';
import { IAuthRepository } from 'src/shared/domain/repositories/auth_repository_interface';
import { AuthRepositoryCognito } from './auth_repository_cognito';
import { IReviewRepository } from 'src/shared/domain/repositories/review_repository_interface';
import { ReviewRepositoryMongo } from './review_repository_mongo';
import { IEmailRepository } from 'src/shared/domain/repositories/email_interface';
import { EmailSESRepository } from './email_repository_ses';

interface RepositoryConfig {
  event_repo?: boolean;
  institute_repo?: boolean;
  presence_repo?: boolean;
  profile_repo?: boolean;
  file_repo?: boolean;
  auth_repo?: boolean;
  review_repo?: boolean;
  email_repo?: boolean;
}

export class Repository {
  event_repo?: IEventRepository;
  institute_repo?: IInstituteRepository;
  presence_repo?: IPresenceRepository;
  profile_repo?: IProfileRepository;
  file_repo?: IFileRepository;
  auth_repo?: IAuthRepository;
  review_repo?: IReviewRepository;
  email_repo?: IEmailRepository;
  private connection: Connection | null = null;

  constructor(private config: RepositoryConfig) {
    this.config.event_repo ??= false;
    this.config.institute_repo ??= false;
    this.config.presence_repo ??= false;
    this.config.profile_repo ??= false;
    this.config.file_repo ??= false;
    this.config.auth_repo ??= false;
    this.config.review_repo ??= false;
    this.config.email_repo ??= false;
  }

  async connectRepository() {
    if (Environments.stage === STAGE.TEST) {
      this._initializeMockRepositories();
    } else {
      await this._initializeDatabaseRepositories();
    }
  }

  private _initializeMockRepositories(): void {}

  private async _initializeDatabaseRepositories(): Promise<void> {
    this.connection = this.connection || (await this.__connectDb());

    console.log('✅ Conexão com MongoDB estabelecida com sucesso.');

    if (this.config.event_repo && !this.event_repo) {
      this.event_repo = new EventRepositoryMongo();
    }
    if (this.config.institute_repo && !this.institute_repo) {
      this.institute_repo = new InstituteRepositoryMongo();
    }
    if (this.config.presence_repo && !this.presence_repo) {
      this.presence_repo = new PresenceRepositoryMongo();
    }
    if (this.config.profile_repo && !this.profile_repo) {
      this.profile_repo = new ProfileRepositoryMongo();
    }
    if (this.config.file_repo && !this.file_repo) {
      this.file_repo = new FileRepositoryS3();
    }
    if (this.config.auth_repo && !this.auth_repo) {
      this.auth_repo = new AuthRepositoryCognito();
    }
    if (this.config.review_repo && !this.review_repo) {
      this.review_repo = new ReviewRepositoryMongo();
    }

    if (this.config.email_repo && !this.email_repo) {
      this.email_repo = new EmailSESRepository();
    }
  }

  private async __connectDb(): Promise<Connection> {
    try {
      await mongoose.connect(Environments.dbUrl);
      console.log('✅ Conexão com MongoDB estabelecida com sucesso.');
      return mongoose.connection;
    } catch (error) {
      throw new DatabaseException(`${error}`);
    }
  }

  public async closeSession(): Promise<void> {
    if (this.connection) {
      await this.connection.close();
      this.connection = null;
      console.log('🛑 Conexão com MongoDB encerrada.');
    }
  }
}
