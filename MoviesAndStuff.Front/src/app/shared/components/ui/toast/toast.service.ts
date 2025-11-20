import { Injectable, signal } from '@angular/core';
import { Toast } from './interfaces/toast';

@Injectable({
  providedIn: 'root'
})
export class ToastService {
  public toasts = signal<Toast[]>([]);
  private nextId = 1;

  public success(message: string) {
    this.show(message, 'success');
  }

  public error(message: string) {
    this.show(message, 'error');
  }

  public info(message: string) {
    this.show(message, 'info');
  }

  private show(message: string, type: 'success' | 'error' | 'info') {
    const toast: Toast = { id: this.nextId++, message, type };
    this.toasts.update(list => [...list, toast]);

    setTimeout(() => this.remove(toast.id), 3000);
  }

  public remove(id: number) {
    this.toasts.update(list => list.filter(t => t.id !== id));
  }
}
