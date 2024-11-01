import { IEventRepository } from "src/shared/domain/irepositories/event_repository_interface";
import { IPresenceRepository } from "src/shared/domain/irepositories/presence_repository_interface";
import { NoItemsFound } from "src/shared/helpers/errors/usecase_errors";

export class GetAllPresencesByEventIdUseCase {
  constructor(
    private readonly eventRepo: IEventRepository,
    private readonly presenceRepo: IPresenceRepository
  ) {}

  async execute(eventId: string) {
    const event = await this.eventRepo.getEventById(eventId);

    if (!event) throw new NoItemsFound("eventId");
    
    const presences = await this.presenceRepo.getAllPresences(eventId);
    
    return presences
  }
}