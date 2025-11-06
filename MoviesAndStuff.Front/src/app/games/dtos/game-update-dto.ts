export interface UpdateGameDto {
  title: string;
  review?: string;
  developer?: string;
  genreId?: number;
  rating?: number;
  releaseDate?: Date;
  playDate?: Date;
  isPlayed: boolean;
}
