import { MediaListConfig } from '../../shared/components/base-media-list/models/base-media-list.models';
import { WatchFilter } from '../enums/watch-filter';
import { WATCH_FILTER_OPTIONS } from '../constants/watch-filter-options';

export const MOVIE_LIST_CONFIG: MediaListConfig<WatchFilter> = {
  mediaTypeId: 'MOVIE',
  routePrefix: '/movies',
  icon: 'ri-film-line',
  collectionName: 'Movie Collection',
  singularName: 'Movie',
  searchPlaceholder: 'Search movie by title...',
  emptyStateMessage: 'No movies in your collection yet.',
  loadingMessage: 'Loading movies...',
  filterOptions: WATCH_FILTER_OPTIONS,
  defaultFilter: WatchFilter.All,
  statusProperty: 'isWatched',
  statusLabel: { active: 'Seen', inactive: 'Queue' },
  dateProperty: 'watchDate',
  showDateColumn: true,
  dateColumnLabel: 'Watched On'
};
