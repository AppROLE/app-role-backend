import { IEventRepository } from "src/shared/domain/irepositories/event_repository_interface";
import { Event } from "src/shared/domain/entities/event";
import { EntityError } from "src/shared/helpers/errors/domain_errors";
import { AGE_ENUM } from "src/shared/domain/enums/age_enum";
import { STATUS } from "src/shared/domain/enums/status_enum";
import { MUSIC_TYPE } from "src/shared/domain/enums/music_type_enum";
import { FEATURE } from "src/shared/domain/enums/feature_enum";
import { PACKAGE_TYPE } from "src/shared/domain/enums/package_type_enum";
import { CATEGORY } from "src/shared/domain/enums/category_enum";

interface UpdateEventParams {
  eventId: string;
  name?: string;
  description?: string;
  address?: string;
  price?: number;
  ageRange?: AGE_ENUM;
  eventDate?: Date;
  districtId?: string;
  instituteId?: string;
  eventStatus?: STATUS;
  musicType?: MUSIC_TYPE[];
  menuLink?: string;
  galeryLink?: string[];
  bannerUrl?: string;
  features?: FEATURE[];
  packageType?: PACKAGE_TYPE[];
  category?: CATEGORY;
  ticketUrl?: string;
}

export class UpdateEventUseCase {
  constructor(private repo: IEventRepository) {}

  async execute(params: UpdateEventParams): Promise<void> {
    const { eventId, ...updatedFields } = params;

    if (!eventId) {
      throw new EntityError("Event ID is required");
    }

    const existingEvent = await this.repo.getEventById(eventId);
    if (!existingEvent) {
      throw new EntityError(`Event with ID ${eventId} not found`);
    }

    const eventToUpdate = new Event({
      eventId: existingEvent.getEventId,
      name: existingEvent.getEventName,
      description: existingEvent.getEventDescription,
      address: existingEvent.getEventAddress,
      price: existingEvent.getEventPrice,
      ageRange: existingEvent.getEventAgeRange,
      eventDate: existingEvent.getEventDate,
      districtId: existingEvent.getEventDistrictId,
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
    if (updatedFields.address) {
      eventToUpdate.setEventAddress = updatedFields.address;
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
    if (updatedFields.districtId) {
      eventToUpdate.setEventDistrictId = updatedFields.districtId;
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
    if (updatedFields.galeryLink) {
      eventToUpdate.setGaleryLink = updatedFields.galeryLink;
    }
    if (updatedFields.bannerUrl) {
      eventToUpdate.setEventBannerUrl = updatedFields.bannerUrl;
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

    const updatedEvent = await this.repo.updateEvent(eventId, {
      name: eventToUpdate.getEventName,
      description: eventToUpdate.getEventDescription,
      address: eventToUpdate.getEventAddress,
      price: eventToUpdate.getEventPrice,
      ageRange: eventToUpdate.getEventAgeRange,
      eventDate: eventToUpdate.getEventDate,
      districtId: eventToUpdate.getEventDistrictId,
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
