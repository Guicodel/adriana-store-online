import { Pipe, type PipeTransform } from '@angular/core';
import { environment } from '../../../environments/environment';
import { ImageOptions } from '../interfaces/product.interface';

const baseApiUrl = environment.baseApiUrl;
@Pipe({
  name: 'productImages',
})
export class ProductImagesPipe implements PipeTransform {

  transform(value:ImageOptions): string{

    if(value.productImg.length < 1)
      return `./assets/images/no-image.jpg`;
    return `http://localhost:3000/api/uploads/products/${value.productId}/${value.productImg[0]}`

}
}
