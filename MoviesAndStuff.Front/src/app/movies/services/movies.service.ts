import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, catchError, throwError } from 'rxjs';
import { Movie } from '../models/movies';
import { MovieListDto } from '../dtos/movie-list-dto';
import { WatchFilter } from '../enums/watch-filter';
import { CreateMovieDto } from '../dtos/movie-create-dto';
import { UpdateMovieDto } from '../dtos/movie-update-dto';
import { MovieDetailDto } from '../dtos/movie-detail-dto';
import { ErrorHandlerService } from '../../shared/error-handler.service';

@Injectable({
  providedIn: 'root'
})

export class MoviesService {
  private readonly errorHandler = inject(ErrorHandlerService);
  private readonly http = inject(HttpClient);

  private api = 'https://localhost:5102/api/movies';

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
      catchError(error => this.errorHandler.handleError(error, 'Movie'))
    );
  }

  getMovieById(id: number): Observable<MovieDetailDto> {
    return this.http.get<MovieDetailDto>(`${this.api}/${id}`)
      .pipe(
        catchError(error => this.errorHandler.handleError(error, 'Movie'))
      );
  }

  createMovie(movie: CreateMovieDto): Observable<CreateMovieDto> {
    return this.http.post<CreateMovieDto>(this.api, movie)
      .pipe(
        catchError(error => this.errorHandler.handleError(error, 'Movie'))
      );
  }

  updateMovie(id: number, movie: UpdateMovieDto): Observable<UpdateMovieDto> {
    return this.http.put<UpdateMovieDto>(`${this.api}/${id}`, movie)
      .pipe(
        catchError(error => this.errorHandler.handleError(error, 'Movie'))
      );
  }

  toggleWatched(id: number): Observable<void> {
    return this.http.patch<void>(`${this.api}/${id}/watched`, null, {
      withCredentials: true
    })
      .pipe(
        catchError(error => this.errorHandler.handleError(error, 'Movie'))
      );
  }

  deleteMovie(id: number): Observable<Movie> {
    return this.http.delete<Movie>(`${this.api}/${id}`)
      .pipe(
        catchError(error => this.errorHandler.handleError(error, 'Movie'))
      );
  }

}
