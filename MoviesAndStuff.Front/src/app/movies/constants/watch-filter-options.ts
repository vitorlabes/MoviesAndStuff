import { WatchFilter } from "../enums/watch-filter";

export interface WatchFilterOption {
  label: string,
  value: WatchFilter,
  icon: string
}

export const WATCH_FILTER_OPTIONS: WatchFilterOption[] = [
  { label: 'All', value: WatchFilter.All, icon: 'ri-list-check' },
  { label: 'Watched', value: WatchFilter.Watched, icon: 'ri-play-circle-line' },
  { label: 'On Queue', value: WatchFilter.Queue, icon: 'ri-check-line' }
];
