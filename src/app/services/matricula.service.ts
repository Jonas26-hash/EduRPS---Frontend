// src/app/services/matricula.service.ts

import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Matricula, MatriculaRequest, MatriculaFilter } from '../models/matricula.model';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class MatriculaService {
  private apiUrl = `${environment.apiUrl}/api/matriculas`;

  constructor(private http: HttpClient) {}

  /**
   * Obtener todas las matrículas
   */
  getAll(): Observable<any> {
    return this.http.get(`${this.apiUrl}`);
  }

  /**
   * Obtener matrículas con filtros
   */
  getAllWithFilters(filters: MatriculaFilter): Observable<any> {
    let params = new HttpParams();
    
    if (filters.nombreEstudiante) {
      params = params.set('nombreEstudiante', filters.nombreEstudiante);
    }
    if (filters.anioAcademico) {
      params = params.set('anioAcademico', filters.anioAcademico.toString());
    }
    if (filters.idGrado) {
      params = params.set('idGrado', filters.idGrado.toString());
    }
    if (filters.estado) {
      params = params.set('estado', filters.estado);
    }

    return this.http.get(`${this.apiUrl}`, { params });
  }

  /**
   * Obtener matrícula por ID
   */
  getById(id: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/${id}`);
  }

  /**
   * Crear nueva matrícula
   */
  create(matricula: MatriculaRequest): Observable<any> {
    return this.http.post(`${this.apiUrl}`, matricula);
  }

  /**
   * Actualizar matrícula
   */
  update(id: number, matricula: Partial<MatriculaRequest>): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, matricula);
  }

  /**
   * Eliminar matrícula
   */
  delete(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }

  /**
   * Obtener historial de matrículas de un estudiante
   */
  getHistorialByEstudiante(idEstudiante: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/estudiante/${idEstudiante}/historial`);
  }

  /**
   * Generar código de matrícula automático
   */
  generarCodigoMatricula(): Observable<any> {
    return this.http.get(`${this.apiUrl}/generar-codigo`);
  }

  /**
   * Verificar disponibilidad de vacantes
   */
  verificarVacantes(idGrado: number, idSeccion: number, anio: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/vacantes/verificar`, {
      params: new HttpParams()
        .set('idGrado', idGrado.toString())
        .set('idSeccion', idSeccion.toString())
        .set('anio', anio.toString())
    });
  }
}