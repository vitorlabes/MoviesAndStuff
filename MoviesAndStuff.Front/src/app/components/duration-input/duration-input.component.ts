import { Component, forwardRef, signal } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

/**
 * Duration input component mas HH:MM
 * Stores as number on FormControl
 * Use: <app-duration-input formControlName="duration" />
 */
@Component({
  selector: 'app-duration-input',
  standalone: true,
  templateUrl: './duration-input.component.html',
  styleUrl: './duration-input.component.scss',
  providers: [{
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => DurationInputComponent),
    multi: true
  }]
})
export class DurationInputComponent implements ControlValueAccessor {
  protected displayValue = signal<string>('');
  protected isDisabled = signal<boolean>(false);

  private onChange: (value: number | null) => void = () => { };
  private onTouched: () => void = () => { };

  onInputChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    let value = input.value.replace(/\D/g, '');

    if (!value) {
      this.displayValue.set('');
      this.onChange(null);
      return;
    }

    if (value.length > 4) value = value.substring(0, 4);

    let formatted = value;
    if (value.length >= 3) {
      formatted = value.substring(0, value.length - 2) + ':' + value.substring(value.length - 2);
    }

    this.displayValue.set(formatted);
    input.value = formatted;

    const minutes = this.hhmmToMinutes(formatted);
    this.onChange(minutes > 0 ? minutes : null);
  }

  onBlur(): void {
    this.onTouched();

    const currentDisplay = this.displayValue();
    if (currentDisplay) {
      const minutes = this.hhmmToMinutes(currentDisplay);
      this.displayValue.set(this.minutesToHHMM(minutes));
    }
  }

  writeValue(value: number | null): void {
    const formatted = value ? this.minutesToHHMM(value) : '';
    this.displayValue.set(formatted);
  }

  registerOnChange(fn: (value: number | null) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.isDisabled.set(isDisabled);
  }

  private hhmmToMinutes(value: string): number {
    if (!value) return 0;

    const parts = value.split(':');
    const hours = parseInt(parts[0] || '0', 10);
    const minutes = parseInt(parts[1] || '0', 10);

    const validMinutes = Math.min(minutes, 59);
    return hours * 60 + validMinutes;
  }

  private minutesToHHMM(minutes: number): string {
    if (!minutes || minutes === 0) return '';

    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;

    return `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}`;
  }
}
