import { EntityError } from '../../helpers/errors/errors';

export interface ReviewProps {
  reviewId: string;
  userId: string;
  eventId: string;
  instituteId: string;
  review: string;
  rating: number;
  createdAt: number;
}

export class Review {
  reviewId: string;
  userId: string;
  eventId: string;
  instituteId: string;
  review: string;
  rating: number;
  createdAt: number;

  constructor(props: ReviewProps) {
    // Validações
    if (!props.reviewId || typeof props.reviewId !== 'string') {
      throw new EntityError('ID da review é obrigatório e deve ser uma string');
    }
    if (!props.userId || typeof props.userId !== 'string') {
      throw new EntityError(
        'ID do usuário é obrigatório e deve ser uma string'
      );
    }
    if (!props.eventId || typeof props.eventId !== 'string') {
      throw new EntityError('ID do evento é obrigatório e deve ser uma string');
    }
    if (!props.instituteId || typeof props.instituteId !== 'string') {
      throw new EntityError(
        'ID do instituto é obrigatório e deve ser uma string'
      );
    }
    if (
      !props.review ||
      props.review.trim().length < 10 ||
      props.review.trim().length > 250
    ) {
      throw new EntityError('A review deve conter entre 10 e 250 caracteres');
    }
    if (
      typeof props.rating !== 'number' ||
      props.rating < 1 ||
      props.rating > 5
    ) {
      throw new EntityError('A nota deve ser um número entre 1 e 5');
    }
    if (!props.createdAt || typeof props.createdAt !== 'number') {
      throw new EntityError(
        'A data de criação é obrigatória e deve ser um timestamp válido'
      );
    }

    // Atribuições
    this.reviewId = props.reviewId;
    this.userId = props.userId;
    this.eventId = props.eventId;
    this.instituteId = props.instituteId;
    this.review = props.review;
    this.rating = props.rating;
    this.createdAt = props.createdAt;
  }
}
