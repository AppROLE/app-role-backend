import { IEventRepository } from 'src/shared/domain/repositories/event_repository_interface';
import { Event } from 'src/shared/domain/entities/event';
import { EntityError } from 'src/shared/helpers/errors/errors';
import { AGE_ENUM } from 'src/shared/domain/enums/age_enum';
import { STATUS } from 'src/shared/domain/enums/status_enum';
import { FEATURE } from 'src/shared/domain/enums/feature_enum';
import { PACKAGE_TYPE } from 'src/shared/domain/enums/package_type_enum';
import { CATEGORY } from 'src/shared/domain/enums/category_enum';
import { Repository } from 'src/shared/infra/database/repositories/repository';
import { IFileRepository } from 'src/shared/domain/repositories/file_repository_interface';
import { Address } from 'src/shared/domain/entities/address';
import { MUSIC_TYPE } from 'src/shared/domain/enums/music_type_enum';

interface UpdateEventParams {
  eventId: string;
  name?: string;
  description?: string;
  address?: Address;
  price?: number;
  ageRange?: AGE_ENUM;
  eventDate?: number;
  instituteId?: string;
  eventStatus?: STATUS;
  musicType?: MUSIC_TYPE[];
  menuLink?: string;
  galleryImages?: {
    image: Buffer;
    mimetype: string;
  }[];
  eventImage?: {
    image: Buffer;
    mimetype: string;
  };
  features?: FEATURE[];
  packageType?: PACKAGE_TYPE[];
  category?: CATEGORY;
  ticketUrl?: string;
  galleryLink?: string[];
  eventPhoto?: string;
}

export class UpdateEventUsecase {
  repository: Repository;
  private event_repo?: IEventRepository;
  private file_repo?: IFileRepository;

  constructor() {
    this.repository = new Repository({
      event_repo: true,
      file_repo: true,
    });
  }

  async connect() {
    await this.repository.connectRepository();
    this.event_repo = this.repository.event_repo;
    this.file_repo = this.repository.file_repo;

    if (!this.event_repo)
      throw new Error('Expected to have an instance of the event repository');
    if (!this.file_repo)
      throw new Error('Expected to have an instance of the file repository');
  }

  async execute(params: UpdateEventParams): Promise<Event> {
    const { eventId, galleryImages: galleryImages, eventImage, ...updatedFields } = params;

    // Verificar se o evento existe
    const eventToUpdate = await this.event_repo!.getEventById(eventId);
    if (!eventToUpdate) {
      throw new EntityError(`Event with id ${eventId} not found`);
    }

    if (galleryImages && galleryImages.length > 0) {
      const galleryUrls: string[] = [];
      for (let i = 0; i < galleryImages.length; i++) {
        const photo = galleryImages[i];
        const photoUrl = await this.file_repo!.uploadImage(
          `events/${eventId}/gallery/${i}.${photo.mimetype.split('/')[1]}`,
          photo.image,
          photo.mimetype,
          true
        );
        galleryUrls.push(photoUrl);
      }
      updatedFields.galleryLink = galleryUrls;
    }

    if (eventImage) {
      const eventPhotoUrl = await this.file_repo!.uploadImage(
        `events/${eventId}/event-photo.${eventImage.mimetype.split('/')[1]}`,
        eventImage.image,
        eventImage.mimetype,
        true
      );
      updatedFields.eventPhoto = eventPhotoUrl;
    }

    return await this.event_repo!.updateEvent(eventId, updatedFields);
  }
}
