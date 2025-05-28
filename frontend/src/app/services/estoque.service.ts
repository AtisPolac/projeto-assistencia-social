import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class EstoqueService {
  private apiUrl = `${environment.apiUrl}/estoque`;

  constructor(private http: HttpClient) { }

  getItens(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl)
      .pipe(
        catchError(this.handleError('getItens', []))
      );
  }

  getItensBaixoEstoque(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/baixo`)
      .pipe(
        catchError(this.handleError('getItensBaixoEstoque', []))
      );
  }

  getItem(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${id}`)
      .pipe(
        catchError(this.handleError(`getItem id=${id}`))
      );
  }

  criarItem(item: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, item)
      .pipe(
        catchError(this.handleError('criarItem'))
      );
  }

  atualizarItem(id: number, item: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${id}`, item)
      .pipe(
        catchError(this.handleError('atualizarItem'))
      );
  }

  registrarEntrada(id: number, dados: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/${id}/entrada`, dados)
      .pipe(
        catchError(this.handleError('registrarEntrada'))
      );
  }

  getHistoricoMovimentacoes(id: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/${id}/movimentacoes`)
      .pipe(
        catchError(this.handleError(`getHistoricoMovimentacoes id=${id}`, []))
      );
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
