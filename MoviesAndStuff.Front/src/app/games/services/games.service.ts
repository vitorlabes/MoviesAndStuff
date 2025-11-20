import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, catchError } from 'rxjs';
import { ErrorHandlerService } from '../../core/services/error-handler.service';
import { GameListDto } from '../dtos/game-list-dto';
import { GameDetailDto } from '../dtos/game-detail-dto';
import { CreateGameDto } from '../dtos/game-create-dto';
import { UpdateGameDto } from '../dtos/game-update-dto';
import { PlayFilter } from '../enums/play-filter';

@Injectable({
  providedIn: 'root'
})
export class GamesService {
  private readonly errorHandler = inject(ErrorHandlerService);
  private readonly http = inject(HttpClient);

  private api = 'https://localhost:5102/api/games';

  /**
   * Fetches a list of games, supporting optional search, genre, and status filters.
   *
   * @param params - Optional criteria for filtering the game list.
   * @returns An Observable of the filtered game list DTOs.
   */
  getGamesList(params?: {
    search?: string;
    genreId?: string;
    playFilter?: PlayFilter;
  }): Observable<GameListDto[]> {
    let httpParams = new HttpParams();

    if (params?.search)
      httpParams = httpParams.set('search', params.search);

    if (params?.genreId)
      httpParams = httpParams.set('genreId', params.genreId);
    if (params?.playFilter !== undefined && params.playFilter !== PlayFilter.All)
      httpParams = httpParams.set('filter', params.playFilter.toString());

    return this.http.get<GameListDto[]>(this.api, {
      params: httpParams,
      withCredentials: true
    }).pipe(
      catchError(error => this.errorHandler.handleError(error, 'Game'))
    );
  }

  /**
 * Retrieves the detailed information for a single game using its ID.
 *
 * @param id - The unique identifier of the game.
 * @returns An Observable of the game detail DTO.
 */
  getGameById(id: number): Observable<GameDetailDto> {
    return this.http.get<GameDetailDto>(`${this.api}/${id}`)
      .pipe(
        catchError(error => this.errorHandler.handleError(error, 'Game'))
      );
  }

  /**
    * Submits data to create a new game record in the system.
    *
    * @param movie - The data transfer object (DTO) containing new game details.
    * @returns An Observable with the created game's full detail DTO.
    */
  createGame(game: CreateGameDto): Observable<GameDetailDto> {
    return this.http.post<GameDetailDto>(this.api, game)
      .pipe(
        catchError(error => this.errorHandler.handleError(error, 'Game'))
      );
  }

  /**
   * Overwrites the details of an existing game record.
   *
   * @param id - The ID of the game to be updated.
   * @param movie - The DTO containing the updated game details.
   * @returns An Observable that completes upon successful update.
   */
  updateGame(id: number, game: UpdateGameDto): Observable<void> {
    return this.http.put<void>(`${this.api}/${id}`, game)
      .pipe(
        catchError(error => this.errorHandler.handleError(error, 'Game'))
      );
  }

  /**
   * Toggles the 'watched' status flag for a specific game via a dedicated endpoint.
   *
   * @param id - The ID of the game to modify.
   * @returns An Observable that completes when the status is updated.
   */
  togglePlayed(id: number): Observable<void> {
    return this.http.patch<void>(`${this.api}/${id}/played`, null, {
      withCredentials: true
    })
      .pipe(
        catchError(error => this.errorHandler.handleError(error, 'Game'))
      );
  }

  /**
   * Permanently removes a game record from the system.
   *
   * @param id - The ID of the game to delete.
   * @returns An Observable that completes upon successful deletion.
   */
  deleteGame(id: number): Observable<void> {
    return this.http.delete<void>(`${this.api}/${id}`)
      .pipe(
        catchError(error => this.errorHandler.handleError(error, 'Game'))
      );
  }
}
