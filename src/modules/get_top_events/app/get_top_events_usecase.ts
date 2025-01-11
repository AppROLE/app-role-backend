import { Event } from 'src/shared/domain/entities/event';
import { IEventRepository } from 'src/shared/domain/repositories/event_repository_interface';
import { IPresenceRepository } from 'src/shared/domain/repositories/presence_repository_interface';
import { Repository } from 'src/shared/infra/database/repositories/repository';
import { getUpcomingWeekdays } from 'src/shared/helpers/utils/date_utils';

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
    // Obter os timestamps de quinta, sexta e sábado
    const { nextThursday, nextFriday, nextSaturday } = getUpcomingWeekdays();

    // Definir o filtro para eventos dentro do intervalo
    const filter = {
      eventDate: {
        $gte: nextThursday, // Timestamp de quinta-feira
        $lte: nextSaturday, // Timestamp de sábado
      },
    };

    console.log('Filter being applied:', filter);

    // Buscar eventos no repositório com base no filtro
    const events = await this.event_repo!.getEventsByFilter(filter);

    // Se nenhum evento for encontrado, retornar uma lista vazia
    if (!events || events.length === 0) {
      console.log('No events found for the given filter.');
      return [];
    }

    // Ordenar eventos por quantidade de presenças e pegar os 3 principais
    const topEvents = events
      .sort((a, b) => b.presencesId.length - a.presencesId.length)
      .slice(0, 3);

    return topEvents;
  }
}
