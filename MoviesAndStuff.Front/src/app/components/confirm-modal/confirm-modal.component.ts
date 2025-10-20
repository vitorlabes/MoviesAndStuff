import { Component, input, output, signal, viewChild, ElementRef } from '@angular/core';

@Component({
  selector: 'app-confirm-modal',
  imports: [],
  templateUrl: './confirm-modal.component.html',
  styleUrl: './confirm-modal.component.scss'
})
export class ConfirmModalComponent {
  public message = input<string>('Do you wish to delete this registry?');
  public title = input<string>('Confirm Action');
  protected confirmText = input<string>('Yes');
  protected cancelText = input<string>('No');

  private _currentMessage = signal<string>('');
  private _currentTitle = signal<string>('');
  public show = signal(false);

  public confirm = output<void>();
  public cancel = output<void>();

  open(customMessage?: string, customTitle?: string) {
    this._currentMessage.set(customMessage || this.message());
    this._currentTitle.set(customTitle || this.title());
    this.show.set(true);

    // Previne scroll do body quando modal está aberto
    document.body.style.overflow = 'hidden';
  }

  close() {
    this.show.set(false);
    document.body.style.overflow = '';
  }

  getCurrentMessage() {
    return this._currentMessage() || this.message();
  }

  getCurrentTitle() {
    return this._currentTitle() || this.title();
  }

  onConfirm() {
    this.confirm.emit();
    this.close();
  }

  onCancel() {
    this.cancel.emit();
    this.close();
  }

  onBackdropClick(event: MouseEvent) {
    if ((event.target as HTMLElement).classList.contains('modal')) {
      this.onCancel();
    }
  }
}
