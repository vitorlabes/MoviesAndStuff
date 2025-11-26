import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, catchError } from 'rxjs';
import { MovieListDto } from '../dtos/movie-list-dto';
import { WatchFilter } from '../enums/watch-filter';
import { MovieFormDto } from '../dtos/movie-form-dto';
import { MovieDetailDto } from '../dtos/movie-detail-dto';
import { ErrorHandlerService } from '../../core/services/error-handler.service';

@Injectable({
  providedIn: 'root'
})
export class MoviesService {
  private readonly errorHandler = inject(ErrorHandlerService);
  private readonly http = inject(HttpClient);

  private api = 'https://localhost:5102/api/movies';

  /**
   * Fetches a list of movies, supporting optional search, genre, and status filters.
   *
   * @param params - Optional criteria for filtering the movie list.
   * @returns An Observable of the filtered movie list DTOs.
   */
  public getMoviesList(params?: {
    search?: string;
    genreId?: string;
    watchFilter?: WatchFilter;
  }): Observable<MovieListDto[]> {
    let httpParams = new HttpParams();

    if (params?.search)
      httpParams = httpParams.set('search', params.search);

    if (params?.genreId)
      httpParams = httpParams.set('genreId', params.genreId);

    if (params?.watchFilter !== undefined && params.watchFilter !== WatchFilter.All)
      httpParams = httpParams.set('filter', params.watchFilter.toString());

    return this.http.get<MovieListDto[]>(this.api, {
      params: httpParams,
      withCredentials: true
    }).pipe(
      catchError(error => this.errorHandler.handleError(error, 'Movie'))
    );
  }

  /**
   * Retrieves the detailed information for a single movie using its ID.
   *
   * @param id - The unique identifier of the movie.
   * @returns An Observable of the movie detail DTO.
   */
  public getMovieById(id: number): Observable<MovieDetailDto> {
    return this.http.get<MovieDetailDto>(`${this.api}/${id}`)
      .pipe(
        catchError(error => this.errorHandler.handleError(error, 'Movie'))
      );
  }

  /**
   * Submits data to create a new movie record in the system.
   *
   * @param movie - The data transfer object (DTO) containing new movie details.
   * @returns An Observable with the created movie's full detail DTO.
   */
  public createMovie(movie: MovieFormDto): Observable<MovieDetailDto> {
    return this.http.post<MovieDetailDto>(this.api, movie)
      .pipe(
        catchError(error => this.errorHandler.handleError(error, 'Movie'))
      );
  }

  /**
   * Overwrites the details of an existing movie record.
   *
   * @param id - The ID of the movie to be updated.
   * @param movie - The DTO containing the updated movie details.
   * @returns An Observable that completes upon successful update.
   */
  public updateMovie(id: number, movie: MovieFormDto): Observable<void> {
    return this.http.put<void>(`${this.api}/${id}`, movie)
      .pipe(
        catchError(error => this.errorHandler.handleError(error, 'Movie'))
      );
  }

  /**
   * Toggles the 'watched' status flag for a specific movie via a dedicated endpoint.
   *
   * @param id - The ID of the movie to modify.
   * @returns An Observable that completes when the status is updated.
   */
  public toggleWatched(id: number): Observable<void> {
    return this.http.patch<void>(`${this.api}/${id}/watched`, null, {
      withCredentials: true
    })
      .pipe(
        catchError(error => this.errorHandler.handleError(error, 'Movie'))
      );
  }

  /**
   * Permanently removes a movie record from the system.
   *
   * @param id - The ID of the movie to delete.
   * @returns An Observable that completes upon successful deletion.
   */
  public deleteMovie(id: number): Observable<void> {
    return this.http.delete<void>(`${this.api}/${id}`)
      .pipe(
        catchError(error => this.errorHandler.handleError(error, 'Movie'))
      );
  }
}
