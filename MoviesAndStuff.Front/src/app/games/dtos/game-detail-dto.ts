export interface GameDetailDto {
  id: number;
  title: string;
  review?: string;
  developer?: string;
  genreId?: number;
  genreName?: string;
  rating?: number;
  releaseDate?: Date;
  playDate?: Date;
  isPlayed: boolean;
}
