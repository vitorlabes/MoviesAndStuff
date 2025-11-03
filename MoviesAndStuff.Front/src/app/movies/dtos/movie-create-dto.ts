export interface CreateMovieDto {
  title: string;
  review?: string;
  director?: string;
  genreId?: number;
  duration?: number;
  rating?: number;
  premiereDate?: Date;
  watchDate?: Date;
  isWatched: boolean;
}
