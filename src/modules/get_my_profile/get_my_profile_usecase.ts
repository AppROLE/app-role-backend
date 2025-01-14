import { Profile } from 'src/shared/domain/entities/profile';
import { STATUS } from 'src/shared/domain/enums/status_enum';
import { IEventRepository } from 'src/shared/domain/repositories/event_repository_interface';
import { IInstituteRepository } from 'src/shared/domain/repositories/institute_repository_interface';
import { IPresenceRepository } from 'src/shared/domain/repositories/presence_repository_interface';
import { IProfileRepository } from 'src/shared/domain/repositories/profile_repository_interface';
import { NoItemsFound } from 'src/shared/helpers/errors/errors';
import { Repository } from 'src/shared/infra/database/repositories/repository';

export interface ConfirmedEventsResponse {
  eventId: string;
  eventName: string;
  instituteName: string;
  neighborhood: string;
  eventStatus: STATUS;
  eventPhoto: string;
  eventDate: number;
}

export class GetMyProfileUseCase {
  repository: Repository;
  private profile_repo?: IProfileRepository;

  constructor() {
    this.repository = new Repository({
      profile_repo: true,
    });
  }

  async connect() {
    await this.repository.connectRepository();
    this.profile_repo = this.repository.profile_repo;

    if (!this.profile_repo)
      throw new Error('Expected to have an instance of the profile repository');
  }

  async execute(userId: string): Promise<Profile> {
    const profile = await this.profile_repo!.getByUserId(userId);
    if (!profile) throw new NoItemsFound('Perfil do usuário não encontrado');

    return profile;
  }
}
