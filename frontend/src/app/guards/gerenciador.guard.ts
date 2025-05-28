import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root'
})
export class GerenciadorGuard implements CanActivate {
  constructor(
    private authService: AuthService,
    private router: Router,
    private snackBar: MatSnackBar
  ) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    const currentUser = this.authService.getUserData();
    
    if (currentUser && (this.authService.isAdmin() || this.authService.isGerenciador())) {
      // Usuário é admin ou gerenciador, permitir acesso
      return true;
    }

    // Usuário não é gerenciador, redirecionar para o dashboard
    this.snackBar.open('Acesso restrito a gerenciadores de grupo.', 'Fechar', {
      duration: 5000
    });
    this.router.navigate(['/dashboard']);
    return false;
  }
}
