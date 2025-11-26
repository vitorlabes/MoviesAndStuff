import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, catchError } from 'rxjs';
import { ErrorHandlerService } from '../../core/services/error-handler.service';
import { GenreListDto } from '../dtos/genre-list-dto';
import { GenreDetailDto } from '../dtos/genre-detail-dto';
import { GenreFormDto } from '../dtos/genre-form-dto';
import { MediaTypeListDto } from '../dtos/media-type-list-dto';


@Injectable({
  providedIn: 'root'
})

export class GenresService {
  private readonly errorHandler = inject(ErrorHandlerService);
  private readonly http = inject(HttpClient);

  private api = 'https://localhost:5102/api/genres';


  /**
 * Fetches a list of genres, supporting optional mediaTypeId and isActive filter.
 *
 * @param params - Optional criteria for filtering the genre list.
 * @returns An Observable of the filtered genre list DTOs.
 */
  public getGenresList(params?: { mediaTypeId?: string; isActive?: boolean }): Observable<GenreListDto[]> {
    let httpParams = new HttpParams();

    if (params?.mediaTypeId)
      httpParams = httpParams.set('mediaTypeId', params.mediaTypeId);

    if (params?.isActive !== undefined)
      httpParams = httpParams.set('isActive', params.isActive.toString());

    return this.http.get<GenreListDto[]>(this.api, {
      params: httpParams,
      withCredentials: true
    }).pipe(
      catchError(error => this.errorHandler.handleError(error, 'Genre'))
    );
  }

  /**
 * Retrieves the detailed information for a single genre using its ID.
 *
 * @param id - The unique identifier of the genre.
 * @returns An Observable of the genre detail DTO.
 */
  public getGenreById(id: number): Observable<GenreDetailDto> {
    return this.http.get<GenreDetailDto>(`${this.api}/${id}`)
      .pipe(
        catchError(error => this.errorHandler.handleError(error, 'Genre'))
      );
  }

  /**
* Submits data to create a new genre record in the system.
*
* @param genre - The data transfer object (DTO) containing new genre details.
* @returns An Observable with the created genre's full detail DTO.
*/
  public createGenre(genre: GenreFormDto): Observable<GenreFormDto> {
    return this.http.post<GenreFormDto>(this.api, genre)
      .pipe(
        catchError(error => this.errorHandler.handleError(error, 'genre'))
      );
  }

  /**
   * Overwrites the details of an existing genre record.
   *
   * @param id - The ID of the genre to be updated.
   * @param genre - The DTO containing the updated genre details.
   * @returns An Observable that completes upon successful update.
   */
  public updateGenre(id: number, genre: GenreFormDto): Observable<void> {
    return this.http.put<void>(`${this.api}/${id}`, genre)
      .pipe(
        catchError(error => this.errorHandler.handleError(error, 'genre'))
      );
  }

  /**
* Fetches a list of mediaTypes
* @returns An Observable of the filtered mediaType list DTOs.
*/
  public getMediaTypeList(): Observable<MediaTypeListDto[]> {
    return this.http.get<MediaTypeListDto[]>(`${this.api}/mediaTypes`).pipe(
      catchError(error => this.errorHandler.handleError(error, 'MediaType'))
    );
  }
}
