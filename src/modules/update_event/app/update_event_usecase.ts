import { IEventRepository } from "src/shared/domain/repositories/event_repository_interface";
import { Event, LocationProps } from "src/shared/domain/entities/event";
import { EntityError } from "src/shared/helpers/errors/errors";
import { AGE_ENUM } from "src/shared/domain/enums/age_enum";
import { STATUS } from "src/shared/domain/enums/status_enum";
import { musicType } from "src/shared/domain/enums/musicType_enum";
import { FEATURE } from "src/shared/domain/enums/feature_enum";
import { PACKAGE_TYPE } from "src/shared/domain/enums/package_type_enum";
import { CATEGORY } from "src/shared/domain/enums/category_enum";
import { Repository } from "src/shared/infra/database/repositories/repository";
import { IFileRepository } from "src/shared/domain/repositories/file_repository_interface";

interface UpdateEventParams {
  eventId: string;
  name?: string;
  description?: string;
  location?: LocationProps;
  price?: number;
  ageRange?: AGE_ENUM;
  eventDate?: Date;
  instituteId?: string;
  eventStatus?: STATUS;
  musicType?: musicType[];
  menuLink?: string;
  galery_images?: {
    image: Buffer;
    mimetype: string;
  }[];
  bannerImage?: {
    image: Buffer;
    mimetype: string;
  };
  features?: FEATURE[];
  packageType?: PACKAGE_TYPE[];
  category?: CATEGORY;
  ticketUrl?: string;
}

export class UpdateEventUseCase {
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

  async execute(params: UpdateEventParams): Promise<Event> {
    const { eventId, ...updatedFields } = params;

    if (!eventId) {
      throw new EntityError("Event ID is required");
    }

    const existingEvent = await this.event_repo!.getEventById(eventId);
    if (!existingEvent) {
      throw new EntityError(`Event with ID ${eventId} not found`);
    }

    const eventToUpdate = new Event({
      eventId: existingEvent.getEventId,
      name: existingEvent.getEventName,
      description: existingEvent.getEventDescription,
      address: existingEvent.getEventLocation,
      price: existingEvent.getEventPrice,
      ageRange: existingEvent.getEventAgeRange,
      eventDate: existingEvent.getEventDate,
      instituteId: existingEvent.getInstituteId,
      eventStatus: existingEvent.getEventStatus,
      musicType: existingEvent.getMusicType,
      menuLink: existingEvent.getMenuLink,
      galeryLink: existingEvent.getGaleryLink,
      bannerUrl: existingEvent.getEventBannerUrl,
      features: existingEvent.getFeatures as FEATURE[],
      packageType: existingEvent.getPackageType,
      category: existingEvent.getCategoryType,
      ticketUrl: existingEvent.getTicketUrl,
      reviews: existingEvent.getReviews,
    });

    if (updatedFields.name) {
      eventToUpdate.setEventName = updatedFields.name;
    }
    if (updatedFields.description) {
      eventToUpdate.setEventDescription = updatedFields.description;
    }
    if (updatedFields.location) {
      eventToUpdate.setEventLocation = updatedFields.location;
    }
    if (updatedFields.price !== undefined) {
      eventToUpdate.setEventPrice = updatedFields.price;
    }
    if (updatedFields.ageRange) {
      eventToUpdate.setEventAgeRange = updatedFields.ageRange;
    }
    if (updatedFields.eventDate) {
      eventToUpdate.setEventDate = updatedFields.eventDate;
    }
    if (updatedFields.instituteId) {
      eventToUpdate.setInstituteId = updatedFields.instituteId;
    }
    if (updatedFields.eventStatus) {
      eventToUpdate.setEventStatus = updatedFields.eventStatus;
    }
    if (updatedFields.musicType) {
      eventToUpdate.setMusicType = updatedFields.musicType;
    }
    if (updatedFields.menuLink) {
      eventToUpdate.setMenuLink = updatedFields.menuLink;
    }
    if (updatedFields.galery_images) {
      let galeryUrls: string[] = [];
      if (params.galery_images && params.galery_images.length > 0) {
        for (let i = 0; i < params.galery_images.length; i++) {
          const photo = params.galery_images[i];
          const photoUrl = await this.file_repo!.uploadImage(
            `events/${existingEvent.getEventId}/galery/${i}.${
              photo.mimetype.split("/")[1]
            }`,
            photo.image,
            photo.mimetype,
            true
          );
          galeryUrls.push(photoUrl);
        }
      }
      eventToUpdate.setGaleryLink = galeryUrls;
    }
    if (updatedFields.bannerImage) {
      let bannerUrl = "";
      if (params.bannerImage) {
        bannerUrl = await this.file_repo!.uploadImage(
          `events/${existingEvent.getEventId}/event-photo.${
            params.bannerImage.mimetype.split("/")[1]
          }`,
          params.bannerImage.image,
          params.bannerImage.mimetype,
          true
        );
      }
      eventToUpdate.setEventBannerUrl = bannerUrl;
    }
    if (updatedFields.features) {
      eventToUpdate.setFeatures = updatedFields.features;
    }
    if (updatedFields.packageType) {
      eventToUpdate.setPackageType = updatedFields.packageType;
    }
    if (updatedFields.category) {
      eventToUpdate.setCategoryType = updatedFields.category;
    }
    if (updatedFields.ticketUrl) {
      eventToUpdate.setTicketUrl = updatedFields.ticketUrl;
    }

    return await this.event_repo!.updateEvent(eventId, {
      name: eventToUpdate.getEventName,
      description: eventToUpdate.getEventDescription,
      location: eventToUpdate.getEventLocation,
      price: eventToUpdate.getEventPrice,
      ageRange: eventToUpdate.getEventAgeRange,
      eventDate: eventToUpdate.getEventDate,
      instituteId: eventToUpdate.getInstituteId,
      eventStatus: eventToUpdate.getEventStatus,
      musicType: eventToUpdate.getMusicType,
      menuLink: eventToUpdate.getMenuLink,
      galeryLink: eventToUpdate.getGaleryLink,
      bannerUrl: eventToUpdate.getEventBannerUrl,
      features: eventToUpdate.getFeatures,
      packageType: eventToUpdate.getPackageType,
      category: eventToUpdate.getCategoryType,
      ticketUrl: eventToUpdate.getTicketUrl,
    });
  }
}
