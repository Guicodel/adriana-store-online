import { Component, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ProductsService } from '../../../products/services/products.service';
import { rxResource } from '@angular/core/rxjs-interop';
import { CommonModule } from '@angular/common';
import { ProductCarouselComponent } from '../../../products/components/product-carousel/product-carousel.component';

@Component({
  selector: 'product-page',
  imports: [CommonModule,ProductCarouselComponent],
  templateUrl: './product-page.component.html',
})
export class ProductPageComponent { 

  activatedRoute = inject(ActivatedRoute);
  productsService = inject(ProductsService);   


  productId = this.activatedRoute.snapshot.params['id'];

  productResource = rxResource({
    request: () =>({id:this.productId}),
    loader: ({request})=>{
      
      return this.productsService.getProductById(request.id);
    }
  });
   
}
