import { IEventRepository } from "src/shared/domain/irepositories/event_repository_interface";
import { IFileRepository } from "src/shared/domain/irepositories/file_repository_interface";
import { IInstituteRepository } from "src/shared/domain/irepositories/institute_repository_interface";
import { NoItemsFound } from "src/shared/helpers/errors/usecase_errors";

export class DeleteInstituteByIdUseCase {
  constructor(
    private readonly instituteRepository: IInstituteRepository,
    private readonly eventRepository: IEventRepository,
    private readonly fileRepository: IFileRepository
  ) {}

  async execute(instituteId: string): Promise<void> {
    const institute = await this.instituteRepository.getInstituteById(
      instituteId
    );
    if (!institute) {
      throw new NoItemsFound("institute");
    }

    console.log("INSTITUTO: ", institute);
    console.log("ARRAY: ", institute.instituteEventsId);

    if (institute.instituteEventsId) {
      for (const eventId of institute.instituteEventsId) {
        const event = await this.eventRepository.getEventById(eventId);

        if (event?.getEventPhotoLink) {
          await this.fileRepository.deleteEventPhotoByEventId(eventId);
        }
        if ((event?.getGaleryLink?.length ?? 0) > 0) {
          await this.fileRepository.deleteGallery(eventId);
        }

        await this.eventRepository.deleteEventById(eventId);
      }
    }
    if (institute.instituteLogoPhoto) {
      await this.fileRepository.deleteInstitutePhoto(institute.instituteName);
    }

    await this.instituteRepository.deleteInstituteById(instituteId);
  }
}
