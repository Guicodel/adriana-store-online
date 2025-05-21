import { Component, input,computed } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Product } from '../../interfaces/product.interface';
import { SlicePipe } from '@angular/common';
import { ProductImagesPipe } from '../../pipes/product-images.pipe';

@Component({
  selector: 'product-card',
  imports: [RouterLink, SlicePipe,ProductImagesPipe],
  templateUrl: './product-card.component.html',
})
export class ProductCardComponent { 
  product = input.required<Product>();
  imageUrl = computed(()=>{

    console.log(`este es el id del producto ${this.product()._id}`);
    return `http://localhost:3000/api/uploads/products/${this.product()._id}/${this.product().img[0]}`
  });
  
}
