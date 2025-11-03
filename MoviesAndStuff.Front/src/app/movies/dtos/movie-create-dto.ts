export interface CreateMovieDto {
  title: string;
  review?: string;
  director?: string;
  genreId?: string;
  duration?: number;
  rating?: number;
  premiereDate?: Date;
  watchDate?: Date;
  isWatched: boolean;
}
