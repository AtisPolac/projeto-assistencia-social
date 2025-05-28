import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AssistidoService {
  private apiUrl = `${environment.apiUrl}/assistidos`;
  private vulneraveisUrl = `${environment.apiUrl}/vulneraveis`;

  constructor(private http: HttpClient) { }

  // Métodos para vulneráveis (fila de espera)
  getVulneraveis(): Observable<any[]> {
    return this.http.get<any[]>(this.vulneraveisUrl)
      .pipe(
        catchError(this.handleError('getVulneraveis', []))
      );
  }

  getVulneravel(id: number): Observable<any> {
    return this.http.get<any>(`${this.vulneraveisUrl}/${id}`)
      .pipe(
        catchError(this.handleError(`getVulneravel id=${id}`))
      );
  }

  criarVulneravel(vulneravel: any): Observable<any> {
    return this.http.post<any>(this.vulneraveisUrl, vulneravel)
      .pipe(
        catchError(this.handleError('criarVulneravel'))
      );
  }

  atualizarVulneravel(id: number, vulneravel: any): Observable<any> {
    return this.http.put<any>(`${this.vulneraveisUrl}/${id}`, vulneravel)
      .pipe(
        catchError(this.handleError('atualizarVulneravel'))
      );
  }

  apadrinharVulneravel(id: number, dados: any): Observable<any> {
    return this.http.post<any>(`${this.vulneraveisUrl}/${id}/apadrinhar`, dados)
      .pipe(
        catchError(this.handleError('apadrinharVulneravel'))
      );
  }

  // Métodos para assistidos (já apadrinhados)
  getAssistidos(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl)
      .pipe(
        catchError(this.handleError('getAssistidos', []))
      );
  }

  getAssistidosPorGrupo(idGrupo: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/grupo/${idGrupo}`)
      .pipe(
        catchError(this.handleError(`getAssistidosPorGrupo id=${idGrupo}`, []))
      );
  }

  getAssistido(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${id}`)
      .pipe(
        catchError(this.handleError(`getAssistido id=${id}`))
      );
  }

  concederExtensao(id: number, dados: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/${id}/extensao`, dados)
      .pipe(
        catchError(this.handleError('concederExtensao'))
      );
  }

  finalizarAssistencia(id: number, dados: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/${id}/finalizar`, dados)
      .pipe(
        catchError(this.handleError('finalizarAssistencia'))
      );
  }

  getHistoricoDoacoes(id: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/${id}/doacoes`)
      .pipe(
        catchError(this.handleError(`getHistoricoDoacoes id=${id}`, []))
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
