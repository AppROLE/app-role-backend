import { v4 as uuidv4 } from "uuid";
import { Event } from "src/shared/domain/entities/event";
import { AGE_ENUM } from "src/shared/domain/enums/age_enum";
import { CATEGORY } from "src/shared/domain/enums/category_enum";
import { FEATURE } from "src/shared/domain/enums/feature_enum";
import { PACKAGE_TYPE } from "src/shared/domain/enums/package_type_enum";
import { STATUS } from "src/shared/domain/enums/status_enum";
import { IEventRepository } from "src/shared/domain/repositories/event_repository_interface";
import { Repository } from "src/shared/infra/database/repositories/repository";
import { IFileRepository } from "src/shared/domain/repositories/file_repository_interface";
import { Address } from "src/shared/domain/entities/address";
import { MUSIC_TYPE } from "src/shared/domain/enums/music_type_enum";

interface CreateEventParams {
  name: string;
  description: string;
  address: Address;
  price: number;
  ageRange: AGE_ENUM;
  eventDate: number;
  instituteId: string;
  eventStatus: STATUS;
  musicType: MUSIC_TYPE[];
  menuLink?: string;
  galery_images: {
    image: Buffer;
    mimetype: string;
  }[];
  bannerImage?: {
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
      throw new Error("Expected to have an instance of the event repository");

    if (!this.file_repo)
      throw new Error("Expected to have an instance of the file repository");
  }

  async execute(params: CreateEventParams): Promise<Event> {
    const event_id = uuidv4();

    let bannerUrl = "";
    if (params.bannerImage) {
      bannerUrl = await this.file_repo!.uploadImage(
        `events/${event_id}/event-photo.${
          params.bannerImage.mimetype.split("/")[1]
        }`,
        params.bannerImage.image,
        params.bannerImage.mimetype,
        true
      );
    }

    let galeryUrls: string[] = [];
    if (params.galery_images && params.galery_images.length > 0) {
      for (let i = 0; i < params.galery_images.length; i++) {
        const photo = params.galery_images[i];
        const photoUrl = await this.file_repo!.uploadImage(
          `events/${event_id}/galery/${i}.${photo.mimetype.split("/")[1]}`,
          photo.image,
          photo.mimetype,
          true
        );
        galeryUrls.push(photoUrl);
      }
    }

    const event = new Event({
      eventId: event_id,
      name: params.name,
      description: params.description,
      address: params.address,
      price: params.price,
      ageRange: params.ageRange,
      eventDate: params.eventDate,
      instituteId: params.instituteId,
      eventStatus: params.eventStatus,
      musicType: params.musicType,
      category: params.category,
      menuLink: params.menuLink,
      galeryLink: galeryUrls,
      bannerUrl: bannerUrl,
      features: params.features,
      packageType: params.packageType,
      ticketUrl: params.ticketUrl,
      reviewsId: [],
      presencesId: [],
      createdAt: new Date().getTime(),
      updatedAt: new Date().getTime(),
    });

    return await this.event_repo!.createEvent(event);
  }
}
