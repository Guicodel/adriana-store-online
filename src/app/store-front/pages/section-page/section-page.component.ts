import { Component,inject } from '@angular/core';
import { rxResource, toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute,Router, NavigationEnd, RouterOutlet } from '@angular/router';
import { filter } from 'rxjs/operators'
import { map } from 'rxjs';
import { GenderNavbarComponent } from '../../components/gender-navbar/gender-navbar.component';
import { CommonModule } from '@angular/common';
import { ProductsService } from '../../../products/services/products.service';
import { Product } from '../../../products/interfaces/product.interface';
import { ProductCardComponent } from '../../../products/components/product-card/product-card.component';
import { PaginationComponent } from '../../../shared/components/pagination/pagination.component';
import { PaginationService } from '../../../shared/components/pagination/pagination.service';

@Component({
  selector: 'app-section-page',
  imports: [GenderNavbarComponent,CommonModule,RouterOutlet,ProductCardComponent,PaginationComponent],
  templateUrl: './section-page.component.html',
})
export class SectionPageComponent { 
  route = inject(ActivatedRoute);
  productsService = inject(ProductsService);
  paginationService = inject(PaginationService);

  //section = toSignal(this.route.params.pipe(map(params => params['section'])),{ initialValue: null });
  section = toSignal(this.route.params.pipe(map(({section})=>section)));
  
    productsResource = rxResource({
      request:()=>({section:this.section(),page:this.paginationService.currentPage()-1}),
      loader:({request})=>{
        return this.productsService.getAllProducts({
          sectionQuery:request.section,
          from:request.page*this.paginationService.itemsPerPage,
          limit:this.paginationService.itemsPerPage
      });
      }
    })
  



  

}
