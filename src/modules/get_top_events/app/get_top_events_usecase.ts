import { Event } from "src/shared/domain/entities/event";
import { IEventRepository } from "src/shared/domain/repositories/event_repository_interface";
import { IPresenceRepository } from "src/shared/domain/repositories/presence_repository_interface";
import { Repository } from "src/shared/infra/database/repositories/repository";
import { getUpcomingWeekdays } from "src/shared/utils/date_utils";

export class GetTopEventsUseCase {
  repository: Repository;
  private event_repo?: IEventRepository;
  private presence_repo?: IPresenceRepository;

  constructor() {
    this.repository = new Repository({
      event_repo: true,
      presence_repo: true,
    });
  }

  async connect() {
    await this.repository.connectRepository();
    this.event_repo = this.repository.event_repo;
    this.presence_repo = this.repository.presence_repo;

    if (!this.event_repo)
      throw new Error("Expected to have an instance of the event repository");
    if (!this.presence_repo)
      throw new Error(
        "Expected to have an instance of the presence repository"
      );
  }

  async execute(): Promise<any> {
    const { nextThursday, nextFriday, nextSaturday } = getUpcomingWeekdays();

    const filter = {
      eventDate: {
        $gte: nextThursday.getTime(), // De quinta-feira (início do dia)
        $lte: nextSaturday.getTime(), // Até sábado (final do dia)
      },
    };

    const events = await this.event_repo!.getEventsByFilter(filter);

    const topEvents = events
      .sort((a, b) => b.presencesId.length - a.presencesId.length)
      .slice(0, 3);

    return topEvents;
  }
}
