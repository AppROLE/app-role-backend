import { IUserRepository } from "src/shared/domain/irepositories/user_repository_interface";

export class GetProfileUseCase {
  constructor(private readonly mongoRepo: IUserRepository) {}

  async execute(username: string, isAnotherUser: boolean, requesterUsername?: string) {
    console.log("GetProfileUseCase -> execute -> username", username)
    console.log("GetProfileUseCase -> execute -> isAnotherUser", isAnotherUser)
    console.log("GetProfileUseCase -> execute -> requesterUsername", requesterUsername)
    return await this.mongoRepo.getProfile(username, isAnotherUser, requesterUsername);
  }
}