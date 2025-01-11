import { Profile } from 'src/shared/domain/entities/profile';
import { GENDER_TYPE } from 'src/shared/domain/enums/gender_enum';
import { PRIVACY_TYPE } from 'src/shared/domain/enums/privacy_enum';
import { IAuthRepository } from 'src/shared/domain/repositories/auth_repository_interface';
import { IFileRepository } from 'src/shared/domain/repositories/file_repository_interface';
import { IProfileRepository } from 'src/shared/domain/repositories/profile_repository_interface';
import { Repository } from 'src/shared/infra/database/repositories/repository';

interface UpdateProfileParams {
  userId: string;
  name?: string;
  username?: string;
  nickname?: string;
  dateBirth?: number;
  gender?: GENDER_TYPE;
  phoneNumber?: string;
  privacy: PRIVACY_TYPE;
  profileImage?: {
    image: Buffer;
    mimetype: string;
  };
  backgroundImage?: {
    image: Buffer;
    mimetype: string;
  };
  biography?: string;
  linkInstagram?: string;
  linkTiktok?: string;
  profilePhoto?: string;
  backgroundPhoto?: string;
  cpf?: string;
}

export class UpdateProfileUsecase {
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

  async execute(params: UpdateProfileParams): Promise<Profile> {
    const { userId, profileImage, backgroundImage, ...updateFields } = params;

    if (profileImage) {
      const profilePhotoUrl = await this.file_repo!.uploadImage(
        `profiles/${userId}/profile-photo.${
          profileImage.mimetype.split('/')[1]
        }`,
        profileImage.image,
        profileImage.mimetype,
        true
      );
      updateFields.profilePhoto = profilePhotoUrl;
    }

    if (backgroundImage) {
      const backgroundPhotoUrl = await this.file_repo!.uploadImage(
        `profiles/${userId}/background-photo.${
          backgroundImage.mimetype.split('/')[1]
        }`,
        backgroundImage.image,
        backgroundImage.mimetype,
        true
      );
      updateFields.backgroundPhoto = backgroundPhotoUrl;
    }

    const updatedProfile = await this.profile_repo!.updateProfile(
      userId,
      updateFields
    );

    if (params.username)
      await this.auth_repo!.updateUser(userId, params.username);

    return updatedProfile;
  }
}
