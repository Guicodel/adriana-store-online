import { Component, input } from '@angular/core';
import { Product } from '../../interfaces/product.interface';
import { ProductImagesPipe } from '../../pipes/product-images.pipe';
import { CurrencyPipe } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'product-table',
  imports: [ProductImagesPipe,CurrencyPipe,RouterLink],
  templateUrl: './product-table.component.html',
})
export class ProductTableComponent { 

    products = input.required<Product[]>();
}
