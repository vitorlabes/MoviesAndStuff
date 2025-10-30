import { AfterViewInit, Component, effect, inject, viewChild } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ToastComponent } from './components/toast/toast.component';
import { ToastService } from './components/toast/toast.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, ToastComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements AfterViewInit {
  public title = 'MoviesAndStuff';
  public toast = viewChild.required<ToastComponent>('toast');

  private readonly _toastService = inject(ToastService);

  ngAfterViewInit(): void {
    effect(() => {
      const toast = this._toastService.toast();
      if (toast) this.toast().show(toast.message, toast.type);
    });
  }
}
