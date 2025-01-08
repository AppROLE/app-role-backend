import { IEventRepository } from "src/shared/domain/repositories/event_repository_interface";
import { IFileRepository } from "src/shared/domain/repositories/file_repository_interface";
import { IInstituteRepository } from "src/shared/domain/repositories/institute_repository_interface";
import { NoItemsFound } from "src/shared/helpers/errors/errors";
import { Repository } from "src/shared/infra/database/repositories/repository";

export class DeleteInstituteByIdUseCase {
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
    if (!this.institute_repo)
      throw new Error('Expected to have an instance of the institute repository');
  }

  async execute(instituteId: string): Promise<void> {
    const institute = await this.institute_repo!.getInstituteById(instituteId);
    if (!institute) {
      throw new NoItemsFound("institute");
    }

    if (institute.instituteEventsId) {
      for (const eventId of institute.instituteEventsId) {
        const event = await this.event_repo!.getEventById(eventId);

        if (event) {
          await this.event_repo!.deleteEventById(eventId);
          await this.file_repo!.deleteFolder(`events/${eventId}`);
        }
      }
    }

    await this.institute_repo!.deleteInstituteById(instituteId);
    await this.file_repo!.deleteFolder(`institutes/${instituteId}`);
  }
}
