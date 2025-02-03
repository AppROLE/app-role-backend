import { Profile } from 'src/shared/domain/entities/profile';
import { IPresenceRepository } from 'src/shared/domain/repositories/presence_repository_interface';
import { IProfileRepository } from 'src/shared/domain/repositories/profile_repository_interface';
import { NoItemsFound } from 'src/shared/helpers/errors/errors';
import { Repository } from 'src/shared/infra/database/repositories/repository';

export class GetMyProfileUseCase {
  repository: Repository;
  private profile_repo?: IProfileRepository;
  private presence_repo?: IPresenceRepository;

  constructor() {
    this.repository = new Repository({
      profile_repo: true,
      presence_repo: true,
    });
  }

  async connect() {
    await this.repository.connectRepository();
    this.profile_repo = this.repository.profile_repo;
    this.presence_repo = this.repository.presence_repo;

    if (!this.profile_repo)
      throw new Error('Expected to have an instance of the profile repository');

    if (!this.presence_repo)
      throw new Error(
        'Expected to have an instance of the presence repository'
      );
  }

  async execute(userId: string): Promise<[Profile, string[]]> {
    const profile = await this.profile_repo!.getByUserId(userId);
    if (!profile) throw new NoItemsFound('Perfil do usuário não encontrado');

    const presences = await this.presence_repo!.getPresencesByUser(userId);

    const eventPresencesIds = presences.map((presence) => presence.eventId);

    return [profile, eventPresencesIds];
  }
}
