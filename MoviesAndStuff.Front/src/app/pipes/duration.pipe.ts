import { Pipe, PipeTransform } from '@angular/core';

/**
 * Duration format pipe
 *
 * Uso:
 * {{ movie.duration | duration }} => "2h 30m"
 * {{ movie.duration | duration:'short' }} => "2:30"
 * {{ movie.duration | duration:'long' }} => "2 hours 30 minutes"
 */
@Pipe({
  name: 'duration',
  standalone: true
})
export class DurationPipe implements PipeTransform {
  transform(minutes: number | null | undefined, format: 'default' | 'short' | 'long' = 'default'): string {
    if (!minutes || minutes === 0) {
      return format === 'long' ? '0 minutes' : '0m';
    }

    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;

    switch (format) {
      case 'short':
        // "2:30"
        return `${hours}:${mins.toString().padStart(2, '0')}`;

      case 'long':
        // "2 hours 30 minutes"
        const hourText = hours === 1 ? 'hour' : 'hours';
        const minText = mins === 1 ? 'minute' : 'minutes';

        if (hours && mins) {
          return `${hours} ${hourText} ${mins} ${minText}`;
        } else if (hours) {
          return `${hours} ${hourText}`;
        } else {
          return `${mins} ${minText}`;
        }

      default:
        // "2h 30m"
        if (hours && mins) {
          return `${hours}h ${mins}m`;
        } else if (hours) {
          return `${hours}h`;
        } else {
          return `${mins}m`;
        }
    }
  }
}
