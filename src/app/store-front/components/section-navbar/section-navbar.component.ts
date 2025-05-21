
import { Component, inject} from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../../auth/services/auth.service';



@Component({
  selector: 'section-navbar',
  imports: [RouterLink,RouterLinkActive],
  templateUrl: './section-navbar.component.html',
})
export class SectionNavbarComponent {
  
    authService = inject(AuthService);
    

 }
