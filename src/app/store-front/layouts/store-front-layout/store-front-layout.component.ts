import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SectionNavbarComponent } from '../../components/section-navbar/section-navbar.component';

@Component({
  selector: 'store-front-layout',
  imports: [RouterOutlet,SectionNavbarComponent],
  templateUrl: './store-front-layout.component.html',
})
export class StoreFrontLayoutComponent { }
