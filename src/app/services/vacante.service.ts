import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Vacante, VacanteRequest } from '../models/vacante.model';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class VacanteService {
  private apiUrl = `${environment.apiUrl}/api/vacantes`;

  constructor(private http: HttpClient) {}

  getAll(): Observable<any> {
    return this.http.get(`${this.apiUrl}`);
  }

  getById(id: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/${id}`);
  }

  create(vacante: VacanteRequest): Observable<any> {
    return this.http.post(`${this.apiUrl}`, vacante);
  }

  update(id: number, vacante: Partial<VacanteRequest>): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, vacante);
  }

  delete(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }

  /**
   * Obtener vacantes disponibles por grado, sección y año
   */
  getDisponibles(idGrado: number, idSeccion: number, anio: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/disponibles`, {
      params: new HttpParams()
        .set('idGrado', idGrado.toString())
        .set('idSeccion', idSeccion.toString())
        .set('anio', anio.toString())
    });
  }

  /**
   * Reservar una vacante
   */
  reservar(idVacante: number): Observable<any> {
    return this.http.post(`${this.apiUrl}/${idVacante}/reservar`, {});
  }

  /**
   * Liberar una vacante
   */
  liberar(idVacante: number): Observable<any> {
    return this.http.post(`${this.apiUrl}/${idVacante}/liberar`, {});
  }
}