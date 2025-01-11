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
    let startDate: number, endDate: number;

    // Define os intervalos de acordo com o dia atual
    if (today === 4) {
      // Quinta-feira
      startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1).getTime(); // Sexta
      endDate = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 2).getTime(); // Sábado
    } else if (today === 5) {
      // Sexta-feira
      startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1).getTime(); // Sábado
      endDate = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1).getTime(); // Sábado
    } else if (today === 6) {
      // Sábado
      const nextWeekThursday = new Date(
        now.getFullYear(),
        now.getMonth(),
        now.getDate() + (7 - today + 4)
      ); // Próxima quinta-feira
      startDate = nextWeekThursday.getTime();
      endDate = new Date(
        nextWeekThursday.getFullYear(),
        nextWeekThursday.getMonth(),
        nextWeekThursday.getDate() + 2
      ).getTime(); // Próximo sábado
    } else {
      // Domingo até quarta-feira
      const thisWeekThursday = new Date(
        now.getFullYear(),
        now.getMonth(),
        now.getDate() + (4 - today)
      ); // Próxima quinta-feira
      startDate = thisWeekThursday.getTime();
      endDate = new Date(
        thisWeekThursday.getFullYear(),
        thisWeekThursday.getMonth(),
        thisWeekThursday.getDate() + 2
      ).getTime(); // Sábado
    }

    // Definir o filtro para eventos dentro do intervalo
    const filter = {
      eventDate: {
        $gte: startDate,
        $lte: endDate,
      },
    };

    console.log('Filter:', filter);

    // Buscar os eventos filtrados
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
