import { AfterViewInit, Component, computed, ElementRef, input, signal, viewChild } from '@angular/core';

// import Swiper JS
import Swiper from 'swiper';
import { Navigation,Pagination} from 'swiper/modules';
// import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import { ProductImagesPipe } from '../../pipes/product-images.pipe';
import { ImageOptions } from '../../interfaces/product.interface';

@Component({
  selector: 'product-carousel',
  imports: [ProductImagesPipe],
  templateUrl: './product-carousel.component.html',
  styles:`
        .swiper{
        with: 100%;
        height: 450px;
        }
  `
})
export class ProductCarouselComponent implements AfterViewInit{ 
  images = input.required<string[]>();
  productId = input.required<string>();
  baseUrl = 'http://localhost:3000/api/uploads/products/'
  swiperDiv = viewChild.required<ElementRef>('swiperDiv');
  ngAfterViewInit(): void {

    const element = this.swiperDiv().nativeElement;
    if(!element){
        return;
      }
      const swiper = new Swiper(element, {
      // Optional parameters
      direction: 'horizontal',
      loop: true,
      modules:[
        Navigation,Pagination
      ],

      // If we need pagination
      pagination: {
        el: '.swiper-pagination',
      },

      // Navigation arrows
      navigation: {
        nextEl: '.swiper-button-next',
        prevEl: '.swiper-button-prev',
      },

      // And if we need scrollbar
      scrollbar: {
        el: '.swiper-scrollbar',
      },
});
  }
}
