import { Profile } from 'src/shared/domain/entities/profile';
import { ROLE_TYPE } from 'src/shared/domain/enums/role_type_enum';
import { IAuthRepository } from 'src/shared/domain/repositories/auth_repository_interface';
import { IFileRepository } from 'src/shared/domain/repositories/file_repository_interface';
import { IProfileRepository } from 'src/shared/domain/repositories/profile_repository_interface';
import { UserAlreadyExists } from 'src/shared/helpers/errors/errors';
import { Repository } from 'src/shared/infra/database/repositories/repository';

interface CreateProfileParams {
  userId: string;
  name: string;
  username: string;
  nickname: string;
  email: string;
  acceptedTerms: boolean;
  image?: {
    image: Buffer;
    mimetype: string;
  };
}

export class CreateProfileUsecase {
  repository: Repository;
  private profile_repo?: IProfileRepository;
  private auth_repo?: IAuthRepository;
  private file_repo?: IFileRepository;

  constructor() {
    this.repository = new Repository({
      profile_repo: true,
      auth_repo: true,
      file_repo: true,
    });
  }

  async connect() {
    await this.repository.connectRepository();
    this.profile_repo = this.repository.profile_repo;
    this.auth_repo = this.repository.auth_repo;
    this.file_repo = this.repository.file_repo;

    if (!this.profile_repo)
      throw new Error('Expected to have an instance of the profile repository');
    if (!this.auth_repo)
      throw new Error('Expected to have an instance of the auth repository');
    if (!this.file_repo)
      throw new Error('Expected to have an instance of the file repository');
  }

  async execute(params: CreateProfileParams): Promise<Profile> {
    const profileValidation = await this.profile_repo!.getByUserId(
      params.userId
    );

    if (profileValidation) {
      throw new UserAlreadyExists();
    }

    let profilePhoto = undefined;

    if (params.image) {
      // Valida a imagem utilizando Rekognition antes do upload
      await this.file_repo!.validateImageContent(params.image.image);

      profilePhoto = await this.file_repo!.uploadImage(
        `profiles/${params.userId}/profile-photo.${
          params.image.mimetype.split('/')[1]
        }`,
        params.image.image,
        params.image.mimetype
      );
    }

    const profile = new Profile({
      userId: params.userId,
      name: params.name,
      username: params.username,
      nickname: params.nickname,
      email: params.email,
      role: ROLE_TYPE.COMMON,
      acceptedTerms: params.acceptedTerms,
      acceptedTermsAt: new Date().getTime(),
      createdAt: new Date().getTime(),
      updatedAt: new Date().getTime(),
      isPrivate: true,
      profilePhoto: profilePhoto,
      followers: [],
      following: [],
      favorites: [],
      reviewsId: [],
      searchHistory: [],
      presencesId: [],
    });

    const profileCreated = await this.profile_repo!.createProfile(profile);

    await this.auth_repo!.updateUser(params.email, params.username);

    return profileCreated;
  }
}
