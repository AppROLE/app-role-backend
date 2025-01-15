import { EntityError } from 'src/shared/helpers/errors/errors';

interface PresenceProps {
  presenceId: string;
  eventId: string;
  userId: string;
  promoterCode?: string;
  createdAt: number;
  eventDate: number;
}

export class Presence {
  presenceId: string;
  eventId: string;
  userId: string;
  promoterCode?: string;
  createdAt: number;
  eventDate: number;

  constructor(props: PresenceProps) {
    // Validações
    if (!props.presenceId || typeof props.presenceId !== 'string') {
      throw new EntityError('ID da presença');
    }

    if (!props.eventId || typeof props.eventId !== 'string') {
      throw new EntityError('ID do evento');
    }

    if (!props.userId || typeof props.userId !== 'string') {
      throw new EntityError('ID do usuário');
    }

    if (props.promoterCode && typeof props.promoterCode !== 'string') {
      throw new EntityError(
        'O código do promotor, se fornecido, deve ser uma string'
      );
    }

    if (!props.createdAt || props.createdAt <= 0) {
      throw new EntityError(
        'A data de criação é obrigatória e deve ser um timestamp válido'
      );
    }

    if (!props.eventDate || props.eventDate <= 0) {
      throw new EntityError(
        'A data do evento é obrigatória e deve ser um timestamp válido'
      );
    }

    if (props.eventDate < Date.now()) {
      throw new EntityError(
        'A data do evento não pode ser anterior à data de criação'
      );
    }

    // Atribuições
    this.presenceId = props.presenceId;
    this.eventId = props.eventId;
    this.userId = props.userId;
    this.promoterCode = props.promoterCode;
    this.createdAt = props.createdAt;
    this.eventDate = props.eventDate;
  }
}
