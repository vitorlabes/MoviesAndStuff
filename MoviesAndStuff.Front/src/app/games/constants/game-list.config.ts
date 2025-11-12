import { MediaListConfig } from './../../shared/components/models/base-media-list.models';
import { PlayFilter } from '../enums/play-filter';
import { PLAY_FILTER_OPTIONS } from './play-filter-options';

export const GAME_LIST_CONFIG: MediaListConfig<PlayFilter> = {
  mediaTypeId: 'GAME',
  routePrefix: '/games',
  icon: 'ri-gamepad-line',
  collectionName: 'Game Collection',
  singularName: 'Game',
  searchPlaceholder: 'Search game by title...',
  emptyStateMessage: 'No games in your collection yet.',
  loadingMessage: 'Loading games...',
  filterOptions: PLAY_FILTER_OPTIONS,
  defaultFilter: PlayFilter.All,
  statusProperty: 'isPlayed',
  statusLabel: { active: 'Played', inactive: 'Queue' },
  dateProperty: 'playDate',
  showDateColumn: true,
  dateColumnLabel: 'Played On'
};
