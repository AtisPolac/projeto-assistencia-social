import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = `${environment.apiUrl}/auth`;
  private tokenKey = 'auth_token';
  private userKey = 'user_data';

  constructor(private http: HttpClient) { }

  login(email: string, password: string): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/login`, { email, password })
      .pipe(
        tap(response => {
          if (response && response.token) {
            this.setToken(response.token);
            this.setUserData(response.user);
          }
        }),
        catchError(this.handleError('login', []))
      );
  }

  register(userData: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/register`, userData)
      .pipe(
        catchError(this.handleError('register', []))
      );
  }

  logout(): void {
    localStorage.removeItem(this.tokenKey);
    localStorage.removeItem(this.userKey);
  }

  recuperarSenha(email: string): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/recuperar-senha`, { email })
      .pipe(
        catchError(this.handleError('recuperarSenha', []))
      );
  }

  getToken(): string {
    return localStorage.getItem(this.tokenKey);
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }

  getUserData(): any {
    const userData = localStorage.getItem(this.userKey);
    return userData ? JSON.parse(userData) : null;
  }

  isAdmin(): boolean {
    const user = this.getUserData();
    return user && user.tipo === 'admin';
  }

  isGerenciador(): boolean {
    const user = this.getUserData();
    return user && user.tipo === 'gerenciador';
  }

  private setToken(token: string): void {
    localStorage.setItem(this.tokenKey, token);
  }

  private setUserData(user: any): void {
    localStorage.setItem(this.userKey, JSON.stringify(user));
  }

  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.error(`${operation} failed: ${error.message}`);
      
      // Retorna um erro amigável para o usuário
      return throwError(() => ({
        error: true,
        message: error.error?.message || 'Ocorreu um erro. Por favor, tente novamente.'
      }));
    };
  }
}
