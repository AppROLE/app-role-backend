import { IInstituteRepository } from "src/shared/domain/repositories/institute_repository_interface";
import { IProfileRepository } from "src/shared/domain/repositories/profile_repository_interface";
import { NoItemsFound } from "src/shared/helpers/errors/errors";
import { Institute } from "src/shared/domain/entities/institute";
import { Repository } from "src/shared/infra/database/repositories/repository";

export class GetAllFavoriteInstitutesUseCase {
  repository: Repository;
  private user_repo?: IProfileRepository;
  private institute_repo?: IInstituteRepository;

  constructor() {
    this.repository = new Repository({
      user_repo: true,
      institute_repo: true,
    });
  }

  async connect() {
    await this.repository.connectRepository();
    this.user_repo = this.repository.profile_repo;
    this.institute_repo = this.repository.institute_repo;

    if (!this.user_repo)
      throw new Error('Expected to have an instance of the user repository');
    if (!this.institute_repo)
      throw new Error('Expected to have an instance of the institute repository');
  }

  async execute(username: string): Promise<Institute[]> {
    const userFavorites = await this.user_repo!.getAllFavoriteInstitutes(
      username
    );

    if (
      !userFavorites ||
      !Array.isArray(userFavorites) ||
      userFavorites.length === 0
    ) {
      throw new NoItemsFound("favorites");
    }

    const favoriteInstitutes = await Promise.all(
      userFavorites.map((favorite: { instituteId: string }) => {
        return this.institute_repo!.getInstituteById(favorite.instituteId);
      })
    );

    if (!favoriteInstitutes || favoriteInstitutes.length === 0) {
      throw new Error("No institutes found for favorites.");
    }

    return favoriteInstitutes;
  }
}
