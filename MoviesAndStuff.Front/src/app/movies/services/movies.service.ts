import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, throwError } from 'rxjs';
import { Movie } from '../models/movies';
import { Genre } from '../models/genres';
import { MovieListDto } from '../dtos/movie-list-dto';

@Injectable({
  providedIn: 'root'
})

export class MoviesService {
  private api = 'https://localhost:5102/api/movies';

  constructor(private http: HttpClient) { }

  getMovieslist(search: string | null = null, genreId: string | null = null): Observable<MovieListDto[]> {
    let params = new HttpParams();

    if (search)
      params = params.set('search', search);

    if (genreId)
      params = params.set('genreId', genreId);

    return this.http.get<MovieListDto[]>(this.api, {
      params,
      withCredentials: true
    })
      .pipe(
        catchError(this.handleError)
      );
  }

  getMovieById(id: number): Observable<Movie> {
    return this.http.get<Movie>(`${this.api}/${id}`)
      .pipe(
        catchError(this.handleError)
      );
  }

  createMovie(movie: Movie): Observable<Movie> {
    return this.http.post<Movie>(this.api, movie)
      .pipe(
        catchError(this.handleError)
      );
  }

  updateMovie(id: number, movie: Movie): Observable<Movie> {
    return this.http.put<Movie>(`${this.api}/${id}`, movie, {
      withCredentials: true
    })
      .pipe(
        catchError(this.handleError)
      );
  }

  deleteMovie(id: number): Observable<Movie> {
    return this.http.delete<Movie>(`${this.api}/${id}`)
      .pipe(
        catchError(this.handleError)
      );
  }

  getGenresList(): Observable<Genre[]> {
    return this.http.get<Genre[]>(`${this.api}/genres`)
      .pipe(
        catchError(this.handleError)
      );
  }






  private handleError(error: HttpErrorResponse): Observable<never> {
    let errorMessage = 'An unknown error occurred';

    if (error.error instanceof ErrorEvent) {
      errorMessage = `Client Error: ${error.error.message}`;
    } else {
      switch (error.status) {
        case 400:
          errorMessage = 'Bad Request: Please check your input data';
          break;
        case 404:
          errorMessage = 'Movie not found';
          break;
        case 500:
          errorMessage = 'Internal Server Error: Please try again later';
          break;
        default:
          errorMessage = `Server Error: ${error.status} - ${error.message}`;
      }
    }

    console.error('MovieService Error:', errorMessage);
    return throwError(() => new Error(errorMessage));
  }

}
