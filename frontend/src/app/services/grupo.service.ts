import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class GrupoService {
  private apiUrl = `${environment.apiUrl}/grupos`;

  constructor(private http: HttpClient) { }

  getGrupos(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl)
      .pipe(
        catchError(this.handleError('getGrupos', []))
      );
  }

  getGrupo(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${id}`)
      .pipe(
        catchError(this.handleError(`getGrupo id=${id}`))
      );
  }

  criarGrupo(grupo: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, grupo)
      .pipe(
        catchError(this.handleError('criarGrupo'))
      );
  }

  atualizarGrupo(id: number, grupo: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${id}`, grupo)
      .pipe(
        catchError(this.handleError('atualizarGrupo'))
      );
  }

  alterarStatus(id: number, ativo: boolean): Observable<any> {
    return this.http.patch<any>(`${this.apiUrl}/${id}/status`, { ativo })
      .pipe(
        catchError(this.handleError('alterarStatus'))
      );
  }

  getGerenciadores(id: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/${id}/gerenciadores`)
      .pipe(
        catchError(this.handleError('getGerenciadores', []))
      );
  }

  adicionarGerenciador(id: number, idGerenciador: number): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/${id}/gerenciadores`, { id_gerenciador: idGerenciador })
      .pipe(
        catchError(this.handleError('adicionarGerenciador'))
      );
  }

  removerGerenciador(id: number, idGerenciador: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${id}/gerenciadores/${idGerenciador}`)
      .pipe(
        catchError(this.handleError('removerGerenciador'))
      );
  }

  getAssistidos(id: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/${id}/assistidos`)
      .pipe(
        catchError(this.handleError('getAssistidos', []))
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
