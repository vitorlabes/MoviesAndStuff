export interface MediaItem {
  id: number;
  title: string;
  genreName: string;
  [key: string]: any;
}

export interface FilterOption<T> {
  label: string;
  value: T;
  icon: string;
}

export interface MediaListConfig<TFilter> {
  mediaTypeId: string;
  routePrefix: string;
  icon: string;
  collectionName: string;
  singularName: string;
  searchPlaceholder: string;
  emptyStateMessage: string;
  loadingMessage: string;
  filterOptions: FilterOption<TFilter>[];
  defaultFilter: TFilter;
  statusProperty: string;
  statusLabel: { active: string; inactive: string };
  dateProperty?: string;
  showDateColumn: boolean;
  dateColumnLabel?: string;
}
