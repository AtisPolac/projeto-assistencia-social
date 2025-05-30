import { Component, computed, inject } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { NavbarComponent } from './shared/navbar/navbar.component';
import { FooterComponent } from './shared/footer/footer.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, NavbarComponent, CommonModule, FooterComponent],
  templateUrl: './app.html',
})
export class App {
  constructor(private router: Router) {}

  showNavbar(): boolean {
    const hiddenRoutes = ['/login', '/register', '/recuperar-senha'];
    return !hiddenRoutes.includes(this.router.url);
  }
}
