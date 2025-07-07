import { Component } from '@angular/core';

@Component({
  selector: 'app-books-view',
  templateUrl: './books-view.component.html',
  styleUrl: './books-view.component.css'
})
export class BooksViewComponent {
  showFilter: boolean = false;

  toggleFilter(): void {
    this.showFilter = !this.showFilter;
  }
}
