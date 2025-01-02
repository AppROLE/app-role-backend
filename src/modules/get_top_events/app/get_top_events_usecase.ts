import { Event } from "src/shared/domain/entities/event";
import { IEventRepository } from "src/shared/domain/repositories/event_repository_interface";
import { IPresenceRepository } from "src/shared/domain/repositories/presence_repository_interface";
import { Repository } from "src/shared/infra/database/repositories/repository";
import { getUpcomingWeekdays } from "src/shared/utils/date_utils";
export class GetTopEventsUseCase {
  repository: Repository;
  private readonly event_repo: IEventRepository;
  private readonly presence_repo: IPresenceRepository;

  constructor() {
    this.repository = new Repository({
      event_repo: true,
      presence_repo: true,
    });
    this.event_repo = this.repository.event_repo!;
    this.presence_repo = this.repository.presence_repo!;
  }

  async execute(): Promise<any> {
    console.log("ENTROU NO USECASE EXECUTE");

    const { nextThursday, nextFriday, nextSaturday } = getUpcomingWeekdays();
    const dates = [nextThursday, nextFriday, nextSaturday];
    const dateLabels = ["Thursday", "Friday", "Saturday"];

    console.log("DADOS DAS DATAS: ", dates);

    const events =
      (await this.event_repo.getEventsByUpcomingDates(dates)) || [];

    console.log("EVENTOS RETORNADOS DO USECASE: ", events);

    const eventsByDate = dates.map((date, index) => {
      const eventsForDate = events.filter(
        (event: Event) =>
          event.getEventDate?.toISOString().slice(0, 10) ===
          date.toISOString().slice(0, 10)
      );

      console.log(`Eventos para ${dateLabels[index]}: `, eventsForDate);

      return {
        date: dateLabels[index],
        events:
          eventsForDate.length > 0
            ? eventsForDate.map((event) => ({
                eventId: event.getEventId,
                name: event.getEventName,
                districtId: event.getEventDistrictId,
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

    console.log("EVENT IDs: ", eventIds);

    const presencesCount = await this.presence_repo.countPresencesByEvent(
      eventIds
    );

    console.log("PRESENCES COUNT: ", presencesCount);

    eventsByDate.forEach((day) => {
      day.events = day.events.map((event) => ({
        ...event,
        presenceCount:
          presencesCount.find((p) => p.eventId === event.eventId)?.count || 0,
      }));

      console.log(`Eventos atualizados para ${day.date}: `, day.events);
    });

    const topEventsByDate = eventsByDate.map((day) => {
      const validEvents = day.events.filter((event) => event.presenceCount > 0);
      if (validEvents.length === 0) {
        console.log(`Nenhum evento com presença para ${day.date}`);
        return { date: day.date, events: [] };
      }
      const topEvent = validEvents.reduce((prev, current) =>
        current.presenceCount > prev.presenceCount ? current : prev
      );
      console.log(`Evento com mais presença para ${day.date}: `, topEvent);
      return { date: day.date, events: [topEvent] };
    });

    const allDatesWithEvents = dateLabels.map((label, index) => {
      const dayWithEvents = topEventsByDate.find((day) => day.date === label);
      return dayWithEvents || { date: label, events: [] };
    });

    console.log("TOP EVENTS BY DATE: ", allDatesWithEvents);

    return allDatesWithEvents;
  }
}
