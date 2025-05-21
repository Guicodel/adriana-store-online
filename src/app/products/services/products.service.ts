import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { Product, ProductsResponse } from "../interfaces/product.interface";
import { Observable, of, tap } from "rxjs";
import { environment } from "../../../environments/environment";


const baseApiUrl = environment.baseApiUrl;
interface Options{
    limit?: number,
    from?: number,
    sectionQuery?:string,
    gender?:string
}
@Injectable({providedIn:'root'})
export class ProductsService{
    private http = inject(HttpClient);

    private productsCache = new Map<string,ProductsResponse>();
    private productCache = new Map<string,Product>();


    getAllProducts(options:Options):Observable<ProductsResponse>{
        const {limit = 9, from = 0, sectionQuery = 'ALL'}=options;

        const key = `${limit}-${from}-${sectionQuery}`
        if(this.productsCache.has(key)){
            return of(this.productsCache.get(key)!);
        }
         return this.http
            .get<ProductsResponse>(`${baseApiUrl}/products`,
                {
                    params:{
                        limit:limit,
                        from:from,
                        sectionQuery:sectionQuery
                    }
                }
            )
            .pipe(
               // tap((resp)=> console.log(resp)),
                tap((resp)=> this.productsCache.set(key,resp))
            );
    }

    getProductById(id:string):Observable<Product>{
        const key = id;
        if(this.productCache.has(key)){
            return of (this.productCache.get(key)!);
        }
        return this.http
            .get<Product>(`${baseApiUrl}/products/${id}`)
            .pipe(
               tap((resp)=> console.log(resp)),
                tap((resp)=>this.productCache.set(key,resp))
            )
    }
}
