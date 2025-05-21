import { CanMatchFn, Route, Router, UrlSegment } from "@angular/router";
import { AuthService } from '../services/auth.service';
import { inject } from "@angular/core";
import { firstValueFrom } from "rxjs";



export const IsAdminGuard:CanMatchFn = async(
    route: Route,
    segments:UrlSegment[]
    )=>{
        const authService = inject(AuthService);
        const router = inject(Router);
        
        await firstValueFrom(authService.checkLoginStatus());
   
        return authService.isAdmin();
    } 