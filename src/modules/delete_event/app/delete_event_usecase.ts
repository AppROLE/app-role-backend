import { IEventRepository } from 'src/shared/domain/repositories/event_repository_interface';
import { IFileRepository } from 'src/shared/domain/repositories/file_repository_interface';
import { IInstituteRepository } from 'src/shared/domain/repositories/institute_repository_interface';
import { NoItemsFound } from 'src/shared/helpers/errors/errors';
import { Repository } from 'src/shared/infra/database/repositories/repository';

export class DeleteEventUsecase {
  repository: Repository;
  private event_repo?: IEventRepository;
  private file_repo?: IFileRepository;
  private institute_repo?: IInstituteRepository;

  constructor() {
    this.repository = new Repository({
      event_repo: true,
      file_repo: true,
      institute_repo: true,
    });
  }

  async connect() {
    await this.repository.connectRepository();
    this.event_repo = this.repository.event_repo;
    this.file_repo = this.repository.file_repo;
    this.institute_repo = this.repository.institute_repo;

    if (!this.event_repo)
      throw new Error('Expected to have an instance of the event repository');
    if (!this.file_repo)
      throw new Error('Expected to have an instance of the file repository');
  }

  async execute(eventId: string): Promise<void> {
    const event = await this.event_repo!.getEventById(eventId);
    if (!event) {
      throw new NoItemsFound('event');
    }

    await this.event_repo!.deleteEvent(eventId);
    await this.file_repo!.deleteFolder(`events/${eventId}`);

    const institute = await this.institute_repo!.getInstituteById(event.instituteId!);
    if (!institute) return

    await this.institute_repo!.updateInstitute(event.instituteId!, { eventsId: institute.eventsId!.filter((id) => id !== eventId) });
  }
}
