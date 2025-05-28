import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class DoacaoService {
  private apiUrl = `${environment.apiUrl}/doacoes`;

  constructor(private http: HttpClient) { }

  getDoacoes(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl)
      .pipe(
        catchError(this.handleError('getDoacoes', []))
      );
  }

  getDoacao(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${id}`)
      .pipe(
        catchError(this.handleError(`getDoacao id=${id}`))
      );
  }

  criarDoacao(doacao: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, doacao)
      .pipe(
        catchError(this.handleError('criarDoacao'))
      );
  }

  gerarComprovante(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${id}/comprovante`)
      .pipe(
        catchError(this.handleError('gerarComprovante'))
      );
  }

  downloadComprovantePDF(id: number): Observable<Blob> {
    return this.http.get(`${this.apiUrl}/${id}/comprovante/pdf`, { responseType: 'blob' })
      .pipe(
        catchError(this.handleError('downloadComprovantePDF'))
      );
  }

  getDoacoesPorAssistido(idAssistido: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/assistido/${idAssistido}`)
      .pipe(
        catchError(this.handleError(`getDoacoesPorAssistido id=${idAssistido}`, []))
      );
  }

  getDoacoesPorGrupo(idGrupo: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/grupo/${idGrupo}`)
      .pipe(
        catchError(this.handleError(`getDoacoesPorGrupo id=${idGrupo}`, []))
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
