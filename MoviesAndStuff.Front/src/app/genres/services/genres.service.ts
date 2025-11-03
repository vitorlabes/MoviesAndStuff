import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, throwError } from 'rxjs';
import { Genre } from '../models/genres';

@Injectable({
  providedIn: 'root'
})

export class GenresService {
  private api = 'https://localhost:5102/api/genres';

  constructor(private http: HttpClient) { }

  getGenresList(): Observable<Genre[]> {
    return this.http.get<Genre[]>(`${this.api}/`)
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
