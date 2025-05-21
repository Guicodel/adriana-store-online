import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators} from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login-page',
  imports: [ReactiveFormsModule],
  templateUrl: './login-page.component.html',
})
export class LoginPageComponent { 

  fb = inject(FormBuilder);
  hasError = signal(false);
  idPosting  = signal(false);
  authService = inject(AuthService);
  router = inject(Router);

  loginForm = this.fb.group({
    email: ['',[Validators.required, Validators.email]],
    password: [ '',[Validators.required, Validators.minLength(5)]]
  });

  onSubmit(){
    if(this.loginForm.invalid){
      this.hasError.set(true);
      setTimeout(()=>{  
        this.hasError.set(false);
      },2000);
      return
    }
    const {email = '',password = ''}= this.loginForm.value;
    this.authService.login(email!,password!).subscribe((isAuthenticated)=>{
      if(isAuthenticated){
        this.router.navigateByUrl('/');
        return;
      }
      this.hasError.set(true);
      setTimeout(()=>{
        this.hasError.set(false);
      },2000);
    })
  }
}

