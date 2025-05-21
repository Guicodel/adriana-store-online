import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'gender-navbar',
  imports: [RouterLink,RouterLinkActive],
  templateUrl: './gender-navbar.component.html',
})
export class GenderNavbarComponent { }
