// src/app/services/padre.service.ts

import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Padre, PadreRequest } from '../models/padre.model';
import type { PadreSearch } from '../models/padre.model';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PadreService {
  private apiUrl = `${environment.apiUrl}/api/padres`;

  constructor(private http: HttpClient) {}

  /**
   * Obtener todos los padres
   */
  getAll(): Observable<any> {
    return this.http.get(`${this.apiUrl}`);
  }

  /**
   * Obtener padre por ID
   */
  getById(id: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/${id}`);
  }

  /**
   * Crear nuevo padre
   */
  create(padre: PadreRequest): Observable<any> {
    return this.http.post(`${this.apiUrl}`, padre);
  }

  /**
   * Actualizar padre
   */
  update(id: number, padre: Partial<PadreRequest>): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, padre);
  }

  /**
   * Eliminar padre
   */
  delete(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }

  /**
   * Buscar padres (para autocomplete)
   */
  search(query: string): Observable<PadreSearch[]> {
    return this.http.get<any>(`${this.apiUrl}`, {
      params: new HttpParams().set('search', query)
    }).pipe(
      map(response => {
        if (response.content) {
          return response.content.map((padre: any) => ({
            idPadre: padre.idPadre,
            nombreCompleto: `${padre.usuario.nombre} ${padre.usuario.apellido}`,
            email: padre.usuario.email,
            telefono: padre.usuario.telefono,
            cantidadHijos: padre.hijos?.length || 0
          }));
        }
        return [];
      })
    );
  }

  /**
   * Obtener hijos de un padre
   */
  getHijos(idPadre: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/${idPadre}/hijos`);
  }
}