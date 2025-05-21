import { computed, inject, Injectable, signal } from '@angular/core';
import { User } from '../interfaces/user.interface';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { AuthCheckResponse, AuthLoginResponse } from '../interfaces/auth-response';
import { catchError, map, Observable, of, tap } from 'rxjs';
import { rxResource } from '@angular/core/rxjs-interop';
type AuthStatus = 'checking'| 'authenticated' | 'not-authenticated';
const baseApiUrl = environment.baseApiUrl;
@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private _authStatus = signal<AuthStatus>('checking');
  private _user = signal<User|null>(null);
  private _token = signal<string|null>(localStorage.getItem('token'));

  private http = inject(HttpClient);
  checkStatusResource = rxResource({
      loader:()=> this.checkLoginStatus()   
  })

  authStatus = computed<AuthStatus>(()=>{
      if(this._authStatus() === 'checking')return 'checking';

      if(this._user() ){
        return 'authenticated'
      }
      return 'not-authenticated'
  });
  //diferencia entre usar llaves y no, correctamente
  user = computed(()=>{ return this._user()});
  token = computed(()=>this._token());
  isAdmin = computed(()=> this._user()?.role.includes('ADMIN_ROLE') ?? false);


  login(email:string,password:string):Observable<boolean>{
    return this.http.post<AuthLoginResponse>(`${baseApiUrl}/auth/login`,{
      email:email,
      password:password
    })
    .pipe(
        tap((resp) => this.handleAuthLoginSuccess(resp)),
      map(() => true),
      catchError((error:any )=>this.handleAuthError(error))
    );
  }
  checkLoginStatus():Observable<boolean>{
    const token = localStorage.getItem('token');
    if(!token){
      this.logout();
      return of(false);
    }
    return this.http.get<AuthCheckResponse>(`${baseApiUrl}/auth/check-login-status`,{
      //de esto ya se encarga el interceptor
      //   headers:new HttpHeaders({
      //       'Authorization-token': token
      // })
    })
    .pipe(
      tap((resp)=> this.handleAuthCheckSuccess(resp)),
      map(()=>true),
      catchError((error:any)=>this.handleAuthError(error))
    );

  }

  logout(){
    this._user.set(null);
    this._token.set(null);
    this._authStatus.set('not-authenticated');
    // Todo volver a activar
    localStorage.removeItem('token');
  }
  private handleAuthLoginSuccess({user,token}:AuthLoginResponse){
      this._user.set(user);
      this._authStatus.set('authenticated');
      this._token.set(token);

      localStorage.setItem('token',token);
  }
  private handleAuthCheckSuccess({authUser,token}:AuthCheckResponse){
      this._user.set(authUser);
      this._authStatus.set('authenticated');
      this._token.set(token);

      localStorage.setItem('token',token);
  }
  private handleAuthError(error:any){
    this.logout();
    return of(false)
  }
}
