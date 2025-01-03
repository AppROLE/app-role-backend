import { IEventRepository } from "src/shared/domain/repositories/event_repository_interface";
import { IFileRepository } from "src/shared/domain/repositories/file_repository_interface";
import { IInstituteRepository } from "src/shared/domain/repositories/institute_repository_interface";
import { NoItemsFound } from "src/shared/helpers/errors/usecase_errors";
import { Repository } from "src/shared/infra/database/repositories/repository";

export class DeleteInstituteByIdUseCase {
  repository: Repository;
  private readonly event_repo: IEventRepository;
  private readonly file_repo: IFileRepository;
  private readonly institute_repo: IInstituteRepository;

  constructor() {
    this.repository = new Repository({
      event_repo: true,
      file_repo: true,
      institute_repo: true,
    });
    this.event_repo = this.repository.event_repo!;
    this.file_repo = this.repository.file_repo!;
    this.institute_repo = this.repository.institute_repo!;
  }

  async execute(instituteId: string): Promise<void> {
    const institute = await this.institute_repo.getInstituteById(instituteId);
    if (!institute) {
      throw new NoItemsFound("institute");
    }

    if (institute.instituteEventsId) {
      for (const eventId of institute.instituteEventsId) {
        const event = await this.event_repo.getEventById(eventId);

        if (event?.getEventPhotoLink) {
          const path = `events/${eventId}/${event.getEventPhotoLink}`;
          await this.file_repo.deleteImage(path);
        }
        if ((event?.getGaleryLink?.length ?? 0) > 0) {
          const path = `events/${eventId}/gallery`;
          await this.file_repo.deleteGallery(eventId);
        }

        await this.event_repo.deleteEventById(eventId);
      }
    }
    if (institute.instituteLogoPhoto) {
      await this.file_repo.deleteInstitutePhoto(institute.instituteName);
    }

    await this.institute_repo.deleteInstituteById(instituteId);
  }
}
