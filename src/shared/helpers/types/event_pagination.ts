import { Event } from '../../domain/entities/event';

export type EventPagination = {
  events: Event[];
  totalPages: number;
  totalCount: number;
  prevPage: number | null;
  nextPage: number | null;
};
