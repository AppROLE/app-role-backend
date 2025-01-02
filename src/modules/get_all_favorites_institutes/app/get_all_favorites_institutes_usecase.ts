import { IInstituteRepository } from "src/shared/domain/repositories/institute_repository_interface";
import { IUserRepository } from "src/shared/domain/repositories/user_repository_interface";
import { NoItemsFound } from "src/shared/helpers/errors/usecase_errors";
import { Institute } from "src/shared/domain/entities/institute";
import { Repository } from "src/shared/infra/database/repositories/repository";

export class GetAllFavoriteInstitutesUseCase {
  repository: Repository;
  private readonly user_repo: IUserRepository;
  private readonly institute_repo: IInstituteRepository;

  constructor() {
    this.repository = new Repository({
      event_repo: true,
      presence_repo: true,
    });
    this.user_repo = this.repository.user_repo!;
    this.institute_repo = this.repository.institute_repo!;
  }

  async execute(username: string): Promise<Institute[]> {
    console.log(
      "Executing use case to get all favorite institutes for user:",
      username
    );

    const userFavorites = await this.user_repo.getAllFavoriteInstitutes(
      username
    );

    if (
      !userFavorites ||
      !Array.isArray(userFavorites) ||
      userFavorites.length === 0
    ) {
      console.log("No favorites found for user in use case.");
      throw new NoItemsFound("favorites");
    }

    console.log(
      "Favorites retrieved in use case, proceeding to fetch institute details:",
      userFavorites
    );

    const favoriteInstitutes = await Promise.all(
      userFavorites.map((favorite: { institute_id: string }) => {
        console.log(
          "Fetching institute details for institute ID:",
          favorite.institute_id
        );
        return this.institute_repo.getInstituteById(favorite.institute_id);
      })
    );

    if (!favoriteInstitutes || favoriteInstitutes.length === 0) {
      console.log("No institutes found for the provided favorite IDs.");
      throw new Error("No institutes found for favorites.");
    }

    console.log(
      "Favorite institutes retrieved successfully:",
      favoriteInstitutes
    );
    return favoriteInstitutes;
  }
}
