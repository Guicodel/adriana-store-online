import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { Product, ProductsResponse } from "../interfaces/product.interface";
import { catchError, Observable, of, tap, throwError } from "rxjs";
import { environment } from "../../../environments/environment";
import { Category } from "../../categories/interfaces/category.inteface";
import { User } from "../../auth/interfaces/user.interface";


const baseApiUrl = environment.baseApiUrl;
interface Options{
    limit?: number,
    from?: number,
    sectionQuery?:string,
    gender?:string
}
const newProduct:Product = {
    _id: "new",
    name: "",
    state: false,
    section: "",
    categoryId: {} as Category,
    description: "",
    userId: {} as User,
    size: [],
    price: 0,
    stock: 0,
    available: false,
    img: [],
    brand: "",
    gender: ""
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
                //tap((resp)=> this.productsCache.set(key,resp))
            );
    }

    getProductById(id:string):Observable<Product>{
        if(id === 'new'){
            return of(newProduct);
        }
        const key = id;
        if(this.productCache.has(key)){
            return of (this.productCache.get(key)!);
        }
        return this.http
            .get<Product>(`${baseApiUrl}/products/${id}`)
            .pipe(
               tap((resp)=> console.log(resp)),
                //tap((resp)=>this.productCache.set(key,resp))
            )
    }
    updateProduct(id:string,producLike:Partial<Product>){
        return this.http.put<Product>(`${baseApiUrl}/products/${id}`,producLike).pipe(
            //tap((product)=>this.updateProductsCache(product)),
            catchError((error:HttpErrorResponse)=>{
                    console.error('error en el servicio', error.error);
                    return throwError (()=>error);
            })
        )
    }
    createProduct(productLike:Partial<Product>)
    {
        return this.http.post<Product>(`${baseApiUrl}/products`, productLike).pipe(
            catchError((error:HttpErrorResponse)=>{
                console.error('error en el servicio',error.error);
                return throwError(()=>error);
            })
        )
    }
    updateProductsCache(product:Product){
        const productId = product._id;
        console.log('este es el producto actualizado que va al cache=> ',product);
        this.productCache.set(productId,product);
        this.productsCache.forEach((response)=>{
            response.products = response.products.map((currentProduct)=>{
                return currentProduct._id === productId ? product : currentProduct 
            })
        })
    }
}
