export interface MovieDetailDto {
  id: number;
  title: string;
  review?: string;
  director?: string;
  genreId?: string;
  genreName?: string;
  duration?: number;
  rating?: number;
  premiereDate?: Date;
  watchDate?: Date;
  isWatched: boolean;
}
