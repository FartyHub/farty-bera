/* eslint-disable @typescript-eslint/no-explicit-any */
export type Pagination<T> = {
  currentPage: number;
  itemCount: number;
  items: T[];
  itemsPerPage: number;
  nextPage: number | null;
  previousPage: number | null;
  totalItems: number;
  totalPages: number;
};

export type PaginationRawAndEntities<T> = {
  currentPage: number;
  itemCount: number;
  items: {
    entities: T[];
    raw: any[];
  };
  itemsPerPage: number;
  nextPage: number | null;
  previousPage: number | null;
  totalItems: number;
  totalPages: number;
};
