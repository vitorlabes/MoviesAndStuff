import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { trigger, transition, style, animate } from '@angular/animations';
import { Toast } from './interfaces/toast';

@Component({
  selector: 'app-toast',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './toast.component.html',
  styleUrls: ['./toast.component.scss'],
  animations: [
    trigger('slideIn', [
      transition(':enter', [
        style({ transform: 'translateX(400px)', opacity: 0 }),
        animate('300ms ease-out', style({ transform: 'translateX(0)', opacity: 1 }))
      ]),
      transition(':leave', [
        animate('200ms ease-in', style({ transform: 'translateX(400px)', opacity: 0 }))
      ])
    ])
  ]
})
export class ToastComponent {
  public toasts = signal<Toast[]>([]);
  private nextId = 1;

  public show(message: string, type: 'success' | 'error' | 'info' = 'success') {
    const toast: Toast = { id: this.nextId++, message, type };
    this.toasts.update(list => [...list, toast]);

    setTimeout(() => this.remove(toast.id), 3000);
  }

  public remove(id: number) {
    this.toasts.update(list => list.filter(t => t.id !== id));
  }

  public getIcon(type: string): string {
    switch (type) {
      case 'success': return 'bi-check-circle-fill';
      case 'error': return 'bi-x-circle-fill';
      case 'info': return 'bi-info-circle-fill';
      default: return 'bi-info-circle-fill';
    }
  }
}
