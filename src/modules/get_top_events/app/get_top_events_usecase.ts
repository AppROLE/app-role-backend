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
      throw new Error('Expected to have an instance of the event repository');
    if (!this.presence_repo)
      throw new Error('Expected to have an instance of the presence repository');
  }

  async execute(): Promise<any> {
    const { nextThursday, nextFriday, nextSaturday } = getUpcomingWeekdays();
    const dates = [nextThursday, nextFriday, nextSaturday];
    const dateLabels = ["Thursday", "Friday", "Saturday"];

    const events =
      (await this.event_repo!.getEventsByUpcomingDates(dates)) || [];

    const eventsByDate = dates.map((date, index) => {
      const eventsForDate = events.filter(
        (event: Event) =>
          event.getEventDate?.toISOString().slice(0, 10) ===
          date.toISOString().slice(0, 10)
      );

      return {
        date: dateLabels[index],
        events:
          eventsForDate.length > 0
            ? eventsForDate.map((event) => ({
                eventId: event.getEventId,
                name: event.getEventName,
                date: event.getEventDate,
                rating:
                  event.getReviews != undefined
                    ? event.getReviews?.reduce(
                        (acc, review) => acc + review.star,
                        0
                      ) / event.getReviews?.length
                    : 0,
                eventPhoto: event.getEventPhotoLink,
                friends: [],
                presenceCount: 0,
              }))
            : [],
      };
    });

    const eventIds = events
      .map((event) => event.getEventId)
      .filter((id): id is string => id !== undefined);

    const presencesCount = await this.presence_repo!.countPresencesByEvent(
      eventIds
    );

    eventsByDate.forEach((day) => {
      day.events = day.events.map((event) => ({
        ...event,
        presenceCount:
          presencesCount.find((p) => p.eventId === event.eventId)?.count || 0,
      }));
    });

    const topEventsByDate = eventsByDate.map((day) => {
      const validEvents = day.events.filter((event) => event.presenceCount > 0);
      if (validEvents.length === 0) {
        return { date: day.date, events: [] };
      }
      const topEvent = validEvents.reduce((prev, current) =>
        current.presenceCount > prev.presenceCount ? current : prev
      );
      return { date: day.date, events: [topEvent] };
    });

    const allDatesWithEvents = dateLabels.map((label, index) => {
      const dayWithEvents = topEventsByDate.find((day) => day.date === label);
      return dayWithEvents || { date: label, events: [] };
    });

    return allDatesWithEvents;
  }
}
