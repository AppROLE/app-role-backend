export type PaginationReturn<T> = {
  items: T[];
  totalPages: number;
  totalCount: number;
  prevPage: number | null;
  nextPage: number | null;
};
