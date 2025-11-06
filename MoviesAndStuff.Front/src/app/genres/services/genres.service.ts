import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, catchError } from 'rxjs';
import { ErrorHandlerService } from '../../shared/error-handler.service';
import { Genre } from '../models/genres';

@Injectable({
  providedIn: 'root'
})

export class GenresService {
  private readonly errorHandler = inject(ErrorHandlerService);
  private readonly http = inject(HttpClient);

  private api = 'https://localhost:5102/api/genres';

  getGenresList(params?: { mediaTypeId?: string; isActive?: boolean }): Observable<Genre[]> {
    let httpParams = new HttpParams();

    if (params?.mediaTypeId)
      httpParams = httpParams.set('mediaTypeId', params.mediaTypeId);

    if (params?.isActive !== undefined)
      httpParams = httpParams.set('isActive', params.isActive.toString());

    return this.http.get<Genre[]>(this.api, {
      params: httpParams,
      withCredentials: true
    }).pipe(
      catchError(error => this.errorHandler.handleError(error, 'Genre'))
    );
  }
}
