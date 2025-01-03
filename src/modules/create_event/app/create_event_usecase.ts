import { Event } from "src/shared/domain/entities/event";
import { AGE_ENUM } from "src/shared/domain/enums/age_enum";
import { CATEGORY } from "src/shared/domain/enums/category_enum";
import { FEATURE } from "src/shared/domain/enums/feature_enum";
import { MUSIC_TYPE } from "src/shared/domain/enums/music_type_enum";
import { PACKAGE_TYPE } from "src/shared/domain/enums/package_type_enum";
import { STATUS } from "src/shared/domain/enums/status_enum";
import { IEventRepository } from "src/shared/domain/repositories/event_repository_interface";
import { Repository } from "src/shared/infra/database/repositories/repository";

interface CreateEventParams {
  name: string;
  description: string;
  address: string;
  price: number;
  ageRange: AGE_ENUM;
  eventDate: Date;
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
  repository: Repository;
  private readonly event_repo: IEventRepository;

  constructor() {
    this.repository = new Repository({
      event_repo: true,
    });
    this.event_repo = this.repository.event_repo!;
  }

  async execute(params: CreateEventParams): Promise<string> {
    const event = new Event({
      name: params.name,
      description: params.description,
      location: params.location,
      price: params.price,
      ageRange: params.ageRange,
      eventDate: params.eventDate,
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

    const savedEvent = await this.event_repo.createEvent(event);

    return savedEvent;
  }
}
