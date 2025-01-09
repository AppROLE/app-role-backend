import { Profile } from 'src/shared/domain/entities/profile';
import { PRIVACY_TYPE } from 'src/shared/domain/enums/privacy_enum';
import { ROLE_TYPE } from 'src/shared/domain/enums/role_type_enum';
import { IAuthRepository } from 'src/shared/domain/repositories/auth_repository_interface';
import { IFileRepository } from 'src/shared/domain/repositories/file_repository_interface';
import { IProfileRepository } from 'src/shared/domain/repositories/profile_repository_interface';
import { UserAlreadyExists } from 'src/shared/helpers/errors/errors';
import { Repository } from 'src/shared/infra/database/repositories/repository';

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

  async execute(
    userId: string,
    name: string,
    username: string,
    nickname: string,
    email: string,
    acceptedTerms: boolean,
    image?: {
      image: Buffer;
      mimetype: string;
    }
  ): Promise<Profile> {
    const profileValidation = await this.profile_repo!.getByUserId(userId);

    if (profileValidation) {
      throw new UserAlreadyExists();
    }

    let profilePhoto = undefined;

    if (image) {
      profilePhoto = await this.file_repo!.uploadImage(
        `profiles/${userId}/profile-photo.${image.mimetype.split('/')[1]}`,
        image.image,
        image.mimetype
      );
    }

    const profile = new Profile({
      userId: userId,
      name: name,
      username: username,
      nickname: nickname,
      email: email,
      role: ROLE_TYPE.COMMON,
      acceptedTerms: acceptedTerms,
      acceptedTermsAt: new Date().getTime(),
      createdAt: new Date().getTime(),
      updatedAt: new Date().getTime(),
      privacy: PRIVACY_TYPE.PUBLIC,
      profilePhoto: profilePhoto,
      followers: [],
      following: [],
      favorites: [],
      reviewsId: [],
      searchHistory: [],
      presencesId: [],
    });

    const profileCreated = await this.profile_repo!.createProfile(profile);

    await this.auth_repo!.updateUser(email, username);

    return profileCreated;
  }
}
