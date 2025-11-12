import { PlayFilter } from "../enums/play-filter";

export interface PlayFilterOption {
  label: string,
  value: PlayFilter,
  icon: string
}

export const PLAY_FILTER_OPTIONS: PlayFilterOption[] = [
  { label: 'All', value: PlayFilter.All, icon: 'ri-list-check' },
  { label: 'Played', value: PlayFilter.Played, icon: 'ri-play-circle-line' },
  { label: 'On Queue', value: PlayFilter.Queue, icon: 'ri-check-line' }
];
