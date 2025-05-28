import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(
    private authService: AuthService,
    private router: Router,
    private snackBar: MatSnackBar
  ) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    const currentUser = this.authService.getUserData();
    
    if (currentUser) {
      // Verifica se a rota requer permissões específicas
      if (route.data['roles'] && !this.checkRoles(currentUser, route.data['roles'])) {
        // Usuário não tem permissão para acessar esta rota
        this.snackBar.open('Você não tem permissão para acessar esta página.', 'Fechar', {
          duration: 5000
        });
        this.router.navigate(['/dashboard']);
        return false;
      }
      
      // Usuário autenticado e com permissões adequadas
      return true;
    }

    // Usuário não está logado, redireciona para a página de login
    this.snackBar.open('Por favor, faça login para acessar esta página.', 'Fechar', {
      duration: 5000
    });
    this.router.navigate(['/auth/login'], { queryParams: { returnUrl: state.url } });
    return false;
  }

  private checkRoles(user: any, requiredRoles: string[]): boolean {
    if (!requiredRoles || requiredRoles.length === 0) {
      return true;
    }

    // Verifica se o usuário tem pelo menos uma das funções necessárias
    if (requiredRoles.includes('admin') && this.authService.isAdmin()) {
      return true;
    }

    if (requiredRoles.includes('gerenciador') && this.authService.isGerenciador()) {
      return true;
    }

    return false;
  }
}
