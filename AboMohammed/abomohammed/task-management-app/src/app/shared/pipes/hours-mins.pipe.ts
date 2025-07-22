import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'hoursMins',
  standalone: true
})
export class HoursMinsPipe implements PipeTransform {
  transform(value: number): string {
    if (isNaN(value) || value < 0) {
      return '0h 0m';
    }
    const hours = Math.floor(value);
    const minutes = Math.round((value - hours) * 60);
    return `${hours}h ${minutes}m`;
  }
}
