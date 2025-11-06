import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, catchError } from 'rxjs';
import { ErrorHandlerService } from '../../shared/error-handler.service';
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

  getGamesList(params: {
    search?: string; genreId?: string; playFilter?: PlayFilter;
  }): Observable<GameListDto[]> {
    let httpParams = new HttpParams();

    if (params.search)
      httpParams = httpParams.set('search', params.search);

    if (params.genreId)
      httpParams = httpParams.set('genreId', params.genreId);

    if (params.playFilter && params.playFilter !== PlayFilter.All)
      httpParams = httpParams.set('playFilter', params.playFilter);

    return this.http.get<GameListDto[]>(this.api, {
      params: httpParams,
      withCredentials: true
    }).pipe(
      catchError(error => this.errorHandler.handleError(error, 'Game'))
    );
  }

  getGameById(id: number): Observable<GameDetailDto> {
    return this.http.get<GameDetailDto>(`${this.api}/${id}`)
      .pipe(
        catchError(error => this.errorHandler.handleError(error, 'Game'))
      );
  }

  createGame(movie: CreateGameDto): Observable<CreateGameDto> {
    return this.http.post<CreateGameDto>(this.api, movie)
      .pipe(
        catchError(error => this.errorHandler.handleError(error, 'Game'))
      );
  }

  updateGame(id: number, movie: UpdateGameDto): Observable<UpdateGameDto> {
    return this.http.put<UpdateGameDto>(`${this.api}/${id}`, movie)
      .pipe(
        catchError(error => this.errorHandler.handleError(error, 'Game'))
      );
  }

  togglePlayed(id: number): Observable<void> {
    return this.http.patch<void>(`${this.api}/${id}/played`, null, {
      withCredentials: true
    })
      .pipe(
        catchError(error => this.errorHandler.handleError(error, 'Game'))
      );
  }

  deleteGame(id: number): Observable<void> {
    return this.http.delete<void>(`${this.api}/${id}`)
      .pipe(
        catchError(error => this.errorHandler.handleError(error, 'Game'))
      );
  }

}
