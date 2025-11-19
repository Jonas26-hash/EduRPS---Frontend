import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Seccion } from '../models/seccion.model';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SeccionService {
  private apiUrl = `${environment.apiUrl}/api/secciones`;

  constructor(private http: HttpClient) {}

  getAll(): Observable<any> {
    return this.http.get(`${this.apiUrl}`);
  }

  getById(id: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/${id}`);
  }

  /**
   * Obtener secciones por grado
   */
  getByGrado(idGrado: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/grado/${idGrado}`);
  }

  /**
   * Verificar capacidad de la sección
   */
  verificarCapacidad(idSeccion: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/${idSeccion}/capacidad`);
  }
}
