import { User } from "../entities/user";
import { GetProfileReturnType } from "../types/get_profile_return_type";

export interface IUserRepository {
  getProfile(username: string, isAnotherUser: boolean, requesterUsername?: string): Promise<GetProfileReturnType>;
  getAllFavoriteInstitutes(username: string): any // Ajustado para retornar um array de favoritos
}
