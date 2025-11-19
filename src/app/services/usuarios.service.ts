import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment.development';
import { Observable } from 'rxjs';

export interface Usuario {
  id: number; nombre: string; apellido: string; email: string; rol: string;
}

@Injectable({ providedIn: 'root' })
export class UsuariosService {
  private base = `${environment.apiUrl}/usuarios`;
  constructor(private http: HttpClient) {}
  listar(): Observable<Usuario[]> { return this.http.get<Usuario[]>(`${this.base}/all`); }
}
