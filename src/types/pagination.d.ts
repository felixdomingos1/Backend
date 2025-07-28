export interface PaginationOptions {
  page?: number;
  pageSize?: number;
}

export interface PaginatedResult<T> {
  data: T[];
  pagination: {
    total: number;
    totalPages: number;
    page: number;
    pageSize: number;
  };
}