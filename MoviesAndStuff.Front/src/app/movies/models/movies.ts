export class Movie {
  id: number = 0;
  title: string = "";
  review: string = "";
  director: string = "";
  genreId: string = "";
  duration: number = 0;
  rating: number = 0;
  premiereDate: Date = new Date();
  watchDate: Date = new Date();
  isWatched: boolean = false;
}
