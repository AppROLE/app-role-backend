import { IInstituteRepository } from "src/shared/domain/irepositories/institute_repository_interface";
import { IUserRepository } from "src/shared/domain/irepositories/user_repository_interface";
import { NoItemsFound } from "src/shared/helpers/errors/usecase_errors";
import { Institute } from "src/shared/domain/entities/institute";

export class GetAllFavoriteInstitutesUseCase {
    constructor(
        private readonly userRepo: IUserRepository,
        private readonly instituteRepo: IInstituteRepository
    ) {}

    async execute(username: string): Promise<Institute[]> {
        const userFavorites = await this.userRepo.getAllFavoriteInstitutes(username);
    
        if (!userFavorites || !Array.isArray(userFavorites) || userFavorites.length === 0) {
            throw new NoItemsFound("favorites");
        }
    
        const favoriteInstitutes = await Promise.all(
            userFavorites.map((favorite: { instituteId: string }) => 
                this.instituteRepo.getInstituteById(favorite.instituteId)
            )
        );
    
        if (!favoriteInstitutes || favoriteInstitutes.length === 0) {
            throw new Error("DEU MERDA!!!");
        }
    
        console.log("FAVORITE INSTITUTES: ", favoriteInstitutes);
    
        return favoriteInstitutes;
    }
    
}
