import { WatchFilter } from "../enums/watch-filter";

export interface WatchFilterOption {
  label: string,
  value: WatchFilter,
  icon: string
}

export const WATCH_FILTER_OPTIONS: WatchFilterOption[] = [
  { label: 'All', value: WatchFilter.All, icon: 'bi-collection-play' },
  { label: 'Watched', value: WatchFilter.Watched, icon: 'bi-check-circle' },
  { label: 'On Queue', value: WatchFilter.Queue, icon: 'bi-clock-history' }
];
