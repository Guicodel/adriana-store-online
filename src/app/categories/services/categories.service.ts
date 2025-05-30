import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { catchError, Observable, throwError} from 'rxjs';
import { CategoriesResponse, Category, newCategory } from '../interfaces/category.inteface';

interface Options {
  limit?:number,
  from?: number

}  
@Injectable({
  providedIn: 'root'
})
export class CategoriesService {
  
  private baseApiUrl = environment.baseApiUrl;
  http = inject(HttpClient);
  getAllCategories():Observable<CategoriesResponse>{

    const url = `${this.baseApiUrl}/categories`;
    return this.http.get<CategoriesResponse>(url);

  }
  getCategoriesBySection(section:string){
    const url = `${this.baseApiUrl}/categories/${section}`;
    return this.http.get<CategoriesResponse>(url);
  }
  createCategory(category:newCategory){
    return this.http.post(`${this.baseApiUrl}/categories`,category).pipe(
      catchError((error:HttpErrorResponse)=>{
        console.error('Error en el servicio:', error.error);
        return throwError(()=> error);
      })
    )
  }
  updateCategory(id:string,categoryLike:Partial<Category>){
     return this.http.put(`${this.baseApiUrl}/categories/${id}`,categoryLike).pipe(
      catchError((error:HttpErrorResponse)=>{
        console.error('Error en el servicio:', error.error);
        return throwError(()=> error);
      })
    )
    
  }

}
