import { PlayFilter } from "../enums/play-filter";

export interface PlayFilterOption {
  label: string,
  value: PlayFilter,
  icon: string
}

export const PLAY_FILTER_OPTIONS: PlayFilterOption[] = [
  { label: 'All', value: PlayFilter.All, icon: 'bi-collection-play' },
  { label: 'Played', value: PlayFilter.Played, icon: 'bi-check-circle' },
  { label: 'On Queue', value: PlayFilter.Queue, icon: 'bi-clock-history' }
];
