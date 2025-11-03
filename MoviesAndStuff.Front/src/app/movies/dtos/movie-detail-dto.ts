export interface MovieDetailDto {
  id: number;
  title: string;
  review?: string;
  director?: string;
  genreId?: number;
  genreName?: string;
  duration?: number;
  rating?: number;
  premiereDate?: Date;
  watchDate?: Date;
  isWatched: boolean;
}
