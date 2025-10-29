import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { ToastData } from './interfaces/toast-data';

@Injectable({
  providedIn: 'root'
})
export class ToastService {
  private toastSubject = new Subject<ToastData>();
  public toast$ = this.toastSubject.asObservable();

  public success(message: string) {
    this.toastSubject.next({ message, type: 'success' });
  }

  public error(message: string) {
    this.toastSubject.next({ message, type: 'error' });
  }

  public info(message: string) {
    this.toastSubject.next({ message, type: 'info' });
  }
}
