import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-filter-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './filter-list.component.html',
  styleUrl: './filter-list.component.scss',
})
export class FilterListComponent {
  @Input() header: string = '';
  @Input() isFilter: boolean = true;
  @Output() searchChange = new EventEmitter<string>();

  isOpenFilter: boolean = false;
  onSearchChange(event: Event) {
    const value = (event.target as HTMLInputElement).value;
    this.searchChange.emit(value);
  }
}
