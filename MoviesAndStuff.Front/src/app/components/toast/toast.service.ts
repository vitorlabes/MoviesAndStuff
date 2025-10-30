import { Injectable, signal } from '@angular/core';
import { ToastData } from './interfaces/toast-data';

@Injectable({
  providedIn: 'root'
})
export class ToastService {
  private _toast = signal<ToastData | null>(null);
  public toast = this._toast.asReadonly();

  public success(message: string) {
    this._toast.set({ message, type: 'success' });
  }

  public error(message: string) {
    this._toast.set({ message, type: 'error' });
  }

  public info(message: string) {
    this._toast.set({ message, type: 'info' });
  }
}
