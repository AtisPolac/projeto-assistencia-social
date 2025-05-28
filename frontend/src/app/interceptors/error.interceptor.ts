import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthService } from '../services/auth.service';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
  constructor(
    private authService: AuthService,
    private router: Router,
    private snackBar: MatSnackBar
  ) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    return next.handle(request).pipe(
      catchError(err => {
        if (err.status === 401) {
          // Auto logout se a resposta for 401 (não autorizado)
          this.authService.logout();
          this.router.navigate(['/auth/login']);
          this.snackBar.open('Sessão expirada. Por favor, faça login novamente.', 'Fechar', {
            duration: 5000
          });
        }
        
        if (err.status === 403) {
          this.snackBar.open('Você não tem permissão para acessar este recurso.', 'Fechar', {
            duration: 5000
          });
          this.router.navigate(['/dashboard']);
        }
        
        const error = err.error?.message || err.statusText;
        return throwError(() => error);
      })
    );
  }
}
