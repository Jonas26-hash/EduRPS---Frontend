
// src/app/components/services/course-content.service.ts
import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import {
  CursoHeaderDTO, UnidadDTO, SesionListItem, TareaListItem, AlumnoMini, SesionDetalle, Recurso
} from '../models/course-content.model';

type Paged<T> = { content: T[] } & Record<string, any>;

@Injectable({ providedIn: 'root' })
export class CourseContentService {
  private http = inject(HttpClient);
  private api = environment.apiUrl;

  // --- helpers ---
  private asArray<T>(x: any): T[] {
    if (Array.isArray(x)) return x;
    if (x && Array.isArray(x.content)) return x.content;
    return [];
  }
  private sortBy<T>(arr: T[], cmp: (a: T, b: T) => number): T[] {
    return [...arr].sort(cmp);
  }

  getCursoHeader(idCurso: number): Observable<CursoHeaderDTO> {
    return this.http.get<CursoHeaderDTO>(`${this.api}/cursos/${idCurso}`);
  }

  getUnidades(idCurso: number): Observable<UnidadDTO[]> {
    return this.http
      .get<UnidadDTO[] | Paged<UnidadDTO>>(`${this.api}/cursos/${idCurso}/unidades`)
      .pipe(
        map(r => this.sortBy(
          this.asArray<UnidadDTO>(r),
          (a, b) => (a.numero ?? 0) - (b.numero ?? 0)
        ))
      );
  }

  getSesiones(idUnidad: number): Observable<SesionListItem[]> {
    return this.http
      .get<SesionListItem[] | Paged<SesionListItem>>(`${this.api}/unidades/${idUnidad}/sesiones`)
      .pipe(
        map(r => this.sortBy(
          this.asArray<SesionListItem>(r),
          (a, b) => (a.numero ?? 0) - (b.numero ?? 0)
        ))
      );
  }

  getTareas(idUnidad: number): Observable<TareaListItem[]> {
    return this.http
      .get<TareaListItem[] | Paged<TareaListItem>>(`${this.api}/unidades/${idUnidad}/tareas`)
      .pipe(
        map(r => this.sortBy(
          this.asArray<TareaListItem>(r),
          (a, b) => {
            const da = a.fechaEntrega ? +new Date(a.fechaEntrega) : 0;
            const db = b.fechaEntrega ? +new Date(b.fechaEntrega) : 0;
            return da - db;
          }
        ))
      );
  }

  getCompaneros(idCurso: number): Observable<AlumnoMini[]> {
    return this.http
      .get<AlumnoMini[] | Paged<AlumnoMini>>(`${this.api}/cursos/${idCurso}/alumnos`)
      .pipe(map(r => this.asArray<AlumnoMini>(r)));
  }

  getSesionDetalle(idSesion: number): Observable<SesionDetalle> {
    return this.http.get<SesionDetalle>(`${this.api}/sesiones/${idSesion}/detalle`);
  }

  crearRecurso(idSesion: number, body: Partial<Recurso>) {
    return this.http.post<Recurso>(`${this.api}/sesiones/${idSesion}/recursos`, body);
  }

  crearTarea(idSesion: number, body: any) {
    return this.http.post(`${this.api}/sesiones/${idSesion}/tareas`, body);
  }
}
