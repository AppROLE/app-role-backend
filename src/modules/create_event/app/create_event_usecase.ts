import { Event } from 'src/shared/domain/entities/event';
import { AGE_ENUM } from 'src/shared/domain/enums/age_enum';
import { CATEGORY } from 'src/shared/domain/enums/category_enum';
import { FEATURE } from 'src/shared/domain/enums/feature_enum';
import { PACKAGE_TYPE } from 'src/shared/domain/enums/package_type_enum';
import { STATUS } from 'src/shared/domain/enums/status_enum';
import { IEventRepository } from 'src/shared/domain/repositories/event_repository_interface';
import { Repository } from 'src/shared/infra/database/repositories/repository';
import { IFileRepository } from 'src/shared/domain/repositories/file_repository_interface';
import { Address } from 'src/shared/domain/entities/address';
import { MUSIC_TYPE } from 'src/shared/domain/enums/music_type_enum';
import { uuidv4 } from 'src/shared/helpers/utils/uuid_util';
import { IInstituteRepository } from 'src/shared/domain/repositories/institute_repository_interface';
import { NoItemsFound } from 'src/shared/helpers/errors/errors';

interface CreateEventParams {
  name: string;
  description: string;
  address: Address;
  price: number;
  ageRange: AGE_ENUM;
  eventDate: number;
  instituteId: string;
  musicType: MUSIC_TYPE[];
  menuLink?: string;
  galleryImages: {
    image: Buffer;
    mimetype: string;
  }[];
  eventImage: {
    image: Buffer;
    mimetype: string;
  };
  packageType: PACKAGE_TYPE[];
  category?: CATEGORY;
  ticketUrl?: string;
  features: FEATURE[];
}

export class CreateEventUseCase {
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
      throw new Error(
        'Expected to have an instance of the institute repository'
      );
  }

  async execute(params: CreateEventParams): Promise<Event> {
    const eventId = uuidv4();

    const institute = await this.institute_repo!.getInstituteById(
      params.instituteId
    );
    if (!institute) {
      throw new NoItemsFound('Instituto não encontrado');
    }

    let eventPhoto = '';
    if (params.eventImage) {
      eventPhoto = await this.file_repo!.uploadImage(
        `events/${eventId}/event-photo.${
          params.eventImage.mimetype.split('/')[1]
        }`,
        params.eventImage.image,
        params.eventImage.mimetype,
        true
      );
    }

    let galleryUrls: string[] = [];
    if (params.galleryImages && params.galleryImages.length > 0) {
      for (let i = 0; i < params.galleryImages.length; i++) {
        const photo = params.galleryImages[i];
        const photoUrl = await this.file_repo!.uploadImage(
          `events/${eventId}/gallery/${i}.${photo.mimetype.split('/')[1]}`,
          photo.image,
          photo.mimetype,
          true
        );
        galleryUrls.push(photoUrl);
      }
    }

    const event = new Event({
      eventId: eventId,
      name: params.name,
      description: params.description,
      address: params.address,
      price: params.price,
      ageRange: params.ageRange,
      eventDate: params.eventDate,
      instituteId: params.instituteId,
      eventStatus: STATUS.ACTIVE,
      musicType: params.musicType,
      category: params.category,
      menuLink: params.menuLink,
      galleryLink: galleryUrls,
      eventPhoto: eventPhoto,
      features: params.features,
      packageType: params.packageType,
      ticketUrl: params.ticketUrl,
      reviewsId: [],
      presencesId: [],
      createdAt: new Date().getTime(),
      updatedAt: new Date().getTime(),
    });

    const createEvent = await this.event_repo!.createEvent(event);

    await this.institute_repo!.addEventToInstitute(
      params.instituteId,
      eventId
    );

    return createEvent;
  }
}
