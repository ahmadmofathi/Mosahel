import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'taskPriority',
  standalone: true
})
export class TaskPriorityPipe implements PipeTransform {

  transform(value: unknown, ...args: unknown[]): unknown {
    return null;
  }

}
