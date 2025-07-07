import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-info-item',
  templateUrl: './info-item.component.html',
  styleUrls: ['./info-item.component.css']
})
export class InfoItemComponent {
  // The title that appears on the clickable area (e.g. "المنهجية", "فرقنا", etc.)
  @Input() title: string = '';
  // The extra info text to display when this item is selected
  @Input() content: string = '';

  // Emit an event when this item is clicked
  @Output() selected = new EventEmitter<{ title: string; content: string }>();

  onSelect(): void {
    // Emit the title and content so that the parent can display them.
    this.selected.emit({ title: this.title, content: this.content });
  }
}
