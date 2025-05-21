import { Component, computed, input, linkedSignal, signal } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-pagination',
  imports: [RouterLink],
  templateUrl: './pagination.component.html',
})
export class PaginationComponent {
  
  numberOfItems = input<number>(0);
  itemsPerPage = input<number>(12);

  currentPage = input<number>(1);
  activePage = linkedSignal(this.currentPage);
  numberOfPages = computed(()=> { 
    const pages = (Math.ceil(this.numberOfItems() / this.itemsPerPage()));
    return Array.from({length:pages},(_,i) => i + 1);
  });

}
