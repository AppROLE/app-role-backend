import { IInstituteRepository } from "src/shared/domain/repositories/institute_repository_interface";
import { IProfileRepository } from "src/shared/domain/repositories/profile_repository_interface";
import { EntityError } from "src/shared/helpers/errors/errors";
import { Repository } from "src/shared/infra/database/repositories/repository";

export class UnfavoriteInstituteUsecase {
  repository: Repository;
  private profile_repo?: IProfileRepository;
  private institute_repo?: IInstituteRepository;

  constructor() {
    this.repository = new Repository({
      profile_repo: true,
      institute_repo: true,
    });
  }

  async connect() {
    await this.repository.connectRepository();
    this.profile_repo = this.repository.profile_repo;
    this.institute_repo = this.repository.institute_repo;

    if (!this.profile_repo)
      throw new Error('Expected to have an instance of the profile repository');

    if (!this.institute_repo)
      throw new Error(
        'Expected to have an instance of the institute repository'
      );
  }

  async execute(userId: string, instituteId: string): Promise<void> {
    const profile = await this.profile_repo!.getByUserId(userId);

    if (!profile) throw new EntityError('profile');

    const institute = await this.institute_repo!.getInstituteById(instituteId);

    if (!institute) throw new EntityError('institute');

    if (!profile.favorites.includes(instituteId))
      throw new EntityError('Instituto não favoritado');

    await this.profile_repo!.removeFavoriteInstitute(userId, instituteId);
  }
}
