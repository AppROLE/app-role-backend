import { Event } from "src/shared/domain/entities/event";
import { AGE_ENUM } from "src/shared/domain/enums/age_enum";
import { CATEGORY } from "src/shared/domain/enums/category_enum";
import { FEATURE } from "src/shared/domain/enums/feature_enum";
import { MUSIC_TYPE } from "src/shared/domain/enums/music_type_enum";
import { PACKAGE_TYPE } from "src/shared/domain/enums/package_type_enum";
import { STATUS } from "src/shared/domain/enums/status_enum";
import { IEventRepository } from "src/shared/domain/irepositories/event_repository_interface";

interface CreateEventParams {
  name: string;
  description: string;
  address: string;
  price: number;
  ageRange: AGE_ENUM;
  eventDate: Date;
  districtId: string;
  instituteId: string;
  eventStatus: STATUS;
  musicType?: MUSIC_TYPE[];
  menuLink?: string;
  galeryLink?: string[];
  bannerUrl?: string;
  features?: FEATURE[];
  packageType?: PACKAGE_TYPE[];
  category?: CATEGORY;
  ticketUrl?: string;
}

export class CreateEventUseCase {
  constructor(private repo: IEventRepository) {}

  async execute(params: CreateEventParams): Promise<string> {
    const event = new Event({
      name: params.name,
      description: params.description,
      address: params.address,
      price: params.price,
      ageRange: params.ageRange,
      eventDate: params.eventDate,
      districtId: params.districtId,
      instituteId: params.instituteId,
      eventStatus: params.eventStatus,
      musicType: params.musicType,
      category: params.category,
      menuLink: params.menuLink,
      galeryLink: params.galeryLink,
      bannerUrl: params.bannerUrl,
      features: params.features,
      packageType: params.packageType,
      ticketUrl: params.ticketUrl,
    });

    const savedEvent = await this.repo.createEvent(event);

    return savedEvent;
  }
}
