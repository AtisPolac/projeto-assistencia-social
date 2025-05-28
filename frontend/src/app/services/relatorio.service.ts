import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { environment } from '../../environments/environment';


@Injectable({
  providedIn: 'root'
})
export class RelatorioService {
  private apiUrl = `${environment.apiUrl}/relatorios`;

  constructor(private http: HttpClient) { }

  getRelatorioAssistidos(filtros: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/assistidos`, filtros)
      .pipe(
        catchError(this.handleError('getRelatorioAssistidos'))
      );
  }

  getRelatorioDoacoes(filtros: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/doacoes`, filtros)
      .pipe(
        catchError(this.handleError('getRelatorioDoacoes'))
      );
  }

  getRelatorioEstoque(filtros: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/estoque`, filtros)
      .pipe(
        catchError(this.handleError('getRelatorioEstoque'))
      );
  }

  exportarRelatorioPDF(tipo: string, filtros: any): Observable<Blob> {
    return this.http.post(`${this.apiUrl}/${tipo}/pdf`, filtros, {
      responseType: 'blob'
    }) as Observable<Blob>;
  }

  exportarRelatorioExcel(tipo: string, filtros: any): Observable<Blob> {
    return this.http.post(`${this.apiUrl}/${tipo}/excel`, filtros, {
      responseType: 'blob'
    }) as Observable<Blob>;
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
