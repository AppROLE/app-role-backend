import { IProfileRepository } from "src/shared/domain/repositories/profile_repository_interface";

export class GetProfileUseCase {
  constructor(private readonly user_repo: IProfileRepository) {}

  async execute(username: string, isAnotherUser: boolean, requesterUsername?: string) {
    return await this.user_repo.getProfile(username, isAnotherUser, requesterUsername);
  }
}