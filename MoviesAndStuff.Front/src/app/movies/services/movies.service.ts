import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, throwError } from 'rxjs';
import { Movie } from '../models/movies';
import { Genre } from '../models/genres';
import { MovieListDto } from '../dtos/movie-list-dto';
import { WatchFilter } from '../enums/watch-filter';

@Injectable({
  providedIn: 'root'
})

export class MoviesService {
  private api = 'https://localhost:5102/api/movies';

  constructor(private http: HttpClient) { }

  getMoviesList(params: {
    search?: string; genreId?: string; watchFilter?: WatchFilter;
  }): Observable<MovieListDto[]> {
    let httpParams = new HttpParams();

    if (params.search)
      httpParams = httpParams.set('search', params.search);

    if (params.genreId)
      httpParams = httpParams.set('genreId', params.genreId);

    if (params.watchFilter && params.watchFilter !== WatchFilter.All)
      httpParams = httpParams.set('watchFilter', params.watchFilter);

    return this.http.get<MovieListDto[]>(this.api, {
      params: httpParams,
      withCredentials: true
    }).pipe(
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

  toggleWatched(id: number): Observable<void> {
    return this.http.patch<void>(`${this.api}/${id}/watched`, {
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
