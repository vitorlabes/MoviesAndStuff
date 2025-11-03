import { Injectable } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';

export interface ErrorDetails {
  message: string;
  status?: number;
  userMessage: string;
}

@Injectable({
  providedIn: 'root'
})
export class ErrorHandlerService {

  handleError(error: HttpErrorResponse, context?: string): Observable<never> {
    const errorDetails = this.buildErrorDetails(error, context);

    return throwError(() => errorDetails);
  }

  private buildErrorDetails(error: HttpErrorResponse, context?: string): ErrorDetails {
    if (error.error instanceof ErrorEvent) {
      return {
        message: error.error.message,
        userMessage: 'A connection error occurred. Please check your internet connection.'
      };
    }

    const userMessage = this.getUserFriendlyMessage(error.status, context);

    return {
      message: error.message,
      status: error.status,
      userMessage
    };
  }

  private getUserFriendlyMessage(status: number, context?: string): string {
    const entity = context?.toLowerCase() || 'resource';

    switch (status) {
      case 400:
        return 'Invalid data provided. Please check your input.';
      case 401:
        return 'You need to be logged in to perform this action.';
      case 403:
        return 'You do not have permission to perform this action.';
      case 404:
        return `The ${entity} was not found.`;
      case 409:
        return `This ${entity} already exists.`;
      case 422:
        return 'The data could not be processed. Please verify your input.';
      case 500:
        return 'An internal server error occurred. Please try again later.';
      case 503:
        return 'The service is temporarily unavailable. Please try again later.';
      default:
        return 'An unexpected error occurred. Please try again.';
    }
  }
}
