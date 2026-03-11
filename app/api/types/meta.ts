export interface Meta {
  total:      number;
  page:       number;
  limit:      number;
  totalPages: number;
  next:       number | null; // 3 ou null
  previous:   number | null; // 1 ou null
}

export interface PaginatedResponse<T> {
  data: T[];
  meta: Meta;
}