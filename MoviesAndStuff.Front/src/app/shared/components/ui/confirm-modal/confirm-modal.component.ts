import { Component, input, output, signal } from '@angular/core';

@Component({
  selector: 'app-confirm-modal',
  imports: [],
  templateUrl: './confirm-modal.component.html'
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

  public open(customMessage?: string, customTitle?: string) {
    this._currentMessage.set(customMessage || this.message());
    this._currentTitle.set(customTitle || this.title());
    this.show.set(true);

    document.body.style.overflow = 'hidden';
  }

  public close() {
    this.show.set(false);
    document.body.style.overflow = '';
  }

  public getCurrentMessage() {
    return this._currentMessage() || this.message();
  }

  public getCurrentTitle() {
    return this._currentTitle() || this.title();
  }

  public onConfirm() {
    this.confirm.emit();
    this.close();
  }

  public onCancel() {
    this.cancel.emit();
    this.close();
  }

  public onBackdropClick(event: MouseEvent) {
    if ((event.target as HTMLElement).classList.contains('modal')) {
      this.onCancel();
    }
  }
}
