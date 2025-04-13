export interface IPaginatedResult<T> {
  items: T[];
  meta: {
    totalItems: number;
    itemsPerPage: number;
    totalPages: number;
    currentPage: number;
  };
}

export interface ISearchPagination<T> extends IPagination<T> {
  search?: string;
}

export interface ISortPagination<T> extends IPagination<T> {
  sort: keyof T;
  order: 'ASC' | 'DESC';
}

export interface ISearchSortPagination<T> extends ISearchPagination<T>, ISortPagination<T> {}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export interface IPagination<T> {
  page: number;
  limit: number;
}
