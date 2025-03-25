import { Event } from 'src/shared/domain/entities/event';
import { IEventRepository } from 'src/shared/domain/repositories/event_repository_interface';
import { IPresenceRepository } from 'src/shared/domain/repositories/presence_repository_interface';
import { Repository } from 'src/shared/infra/database/repositories/repository';

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
      throw new Error(
        'Expected to have an instance of the presence repository'
      );
  }

  async execute(): Promise<Event[]> {
    const now = new Date();
    const today = now.getDay(); // 0 = Sunday, 1 = Monday, ..., 6 = Saturday
    let startDate: Date, endDate: Date;

    // Define os intervalos de acordo com o dia atual
    if (today === 4) {
      // Quinta-feira
      startDate = new Date(
        now.getFullYear(),
        now.getMonth(),
        now.getDate() + 1
      ); // Sexta
      endDate = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 2); // Sábado
    } else if (today === 5) {
      // Sexta-feira
      startDate = new Date(
        now.getFullYear(),
        now.getMonth(),
        now.getDate() + 1
      ); // Sábado
      endDate = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1); // Sábado
    } else if (today === 6) {
      // Sábado
      const nextWeekThursday = new Date(
        now.getFullYear(),
        now.getMonth(),
        now.getDate() + (7 - today + 4)
      ); // Próxima quinta-feira
      startDate = nextWeekThursday;
      endDate = new Date(
        nextWeekThursday.getFullYear(),
        nextWeekThursday.getMonth(),
        nextWeekThursday.getDate() + 2
      ); // Próximo sábado
    } else {
      // Domingo até quarta-feira
      const thisWeekThursday = new Date(
        now.getFullYear(),
        now.getMonth(),
        now.getDate() + (4 - today)
      ); // Próxima quinta-feira
      startDate = thisWeekThursday;
      endDate = new Date(
        thisWeekThursday.getFullYear(),
        thisWeekThursday.getMonth(),
        thisWeekThursday.getDate() + 2
      ); // Sábado
    }

    const filter = {
      eventDate: {
        $gte: startDate,
        $lte: endDate,
      },
    };

    const result = await this.event_repo!.getEventsByFilter(1, filter);

    const events = result.items;

    if (!events || events.length === 0) {
      return [];
    }

    const topEvents = events
      .sort((a, b) => b.presencesId.length - a.presencesId.length)
      .slice(0, 3);

    return topEvents;
  }
}
