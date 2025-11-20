import { Component, forwardRef, signal } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-star-rating',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './star-rating.component.html',
  styleUrls: ['./star-rating.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => StarRatingComponent),
      multi: true
    }
  ]
})
export class StarRatingComponent implements ControlValueAccessor {
  protected readonly maxStars = 10;
  protected readonly stars = Array.from({ length: this.maxStars }, (_, i) => i + 1);
  protected readonly rating = signal<number>(0);
  protected readonly hoverRating = signal<number>(0);
  protected disabled = false;

  private onChange: (value: number) => void = () => { };
  private onTouched: () => void = () => { };

  protected onStarClick(star: number, event: MouseEvent): void {
    if (this.disabled) return;

    const target = event.currentTarget as HTMLElement;
    const rect = target.getBoundingClientRect();
    const clickX = event.clientX - rect.left;
    const isLeftHalf = clickX < rect.width / 2;

    const newRating = isLeftHalf ? star - 0.5 : star;

    const finalRating = this.rating() === newRating ? 0 : newRating;

    this.rating.set(finalRating);
    this.onChange(finalRating);
    this.onTouched();
  }

  protected onStarHover(star: number, event: MouseEvent): void {
    if (this.disabled) return;

    const target = event.currentTarget as HTMLElement;
    const rect = target.getBoundingClientRect();
    const hoverX = event.clientX - rect.left;
    const isLeftHalf = hoverX < rect.width / 2;

    this.hoverRating.set(isLeftHalf ? star - 0.5 : star);
  }

  protected onMouseLeave(): void {
    this.hoverRating.set(0);
  }

  protected getStarFillPercentage(star: number): 'empty' | 'half' | 'full' {
    const displayRating = this.hoverRating() || this.rating();

    if (star <= displayRating) {
      return 'full';
    } else if (star - 0.5 === displayRating) {
      return 'half';
    }
    return 'empty';
  }

  public writeValue(value: number): void {
    this.rating.set(value || 0);
  }

  public registerOnChange(fn: (value: number) => void): void {
    this.onChange = fn;
  }

  public registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  public setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }
}
