import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { AsignacionCursoDTO, UICourse } from '../models/asignacion.model';
import { resolveCover } from '../models/cover-resolver';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class CoursesService {
  private base = environment.apiUrl || 'http://localhost:8080/api';

  constructor(private http: HttpClient) {}

  private authHeaders(): HttpHeaders {
    const token = localStorage.getItem('token') || localStorage.getItem('access_token');
    return token ? new HttpHeaders({ Authorization: `Bearer ${token}` }) : new HttpHeaders();
  }

  private getAllAsignaciones(): Observable<AsignacionCursoDTO[]> {
    const url = `${this.base}/asignacioncurso`;
    return this.http.get<AsignacionCursoDTO[]>(url, { headers: this.authHeaders() });
  }

  getTeacherCourses(idDocente: number, anioId?: number): Observable<UICourse[]> {
    return this.getAllAsignaciones().pipe(
      map(list => {
        // --- trazas para depurar ---
        console.log('[ASIG] total', list.length, 'docenteId=', idDocente, 'anioId=', anioId);
        // Comparación robusta: el id del docente puede venir con nombres distintos o como string
        const byDoc = list.filter(a => {
          const aa: any = a;
          const assignedId = aa?.docente?.idDocente ?? aa?.docente?.id ?? aa?.docente;
          // normalizar a string para evitar problemas tipo ("1" vs 1)
          return assignedId != null && String(assignedId) === String(idDocente);
        });
        console.log('[ASIG] match por docente:', byDoc.length, 'samples=', byDoc.slice(0,3));
        const byYear = anioId ? byDoc.filter(a => a.anio?.idAnio === anioId) : byDoc;
        console.log('[ASIG] match por anio:', byYear.length);
        return byYear;
      }),
      map(list => list.map(a => ({
        id: a.curso.idCurso,
        title: a.curso.nombre,
        coverUrl: a.curso.coverUrl || resolveCover(a.curso.nombre),
        grade: a.grado?.nombre,
        gradeColor: this.pickBadgeColor(a.grado?.nombre),
      } satisfies UICourse)))
    );
  }

  getStudentCourses(gradoId?: number, anioId?: number): Observable<UICourse[]> {
    return this.getAllAsignaciones().pipe(
      map(list => {
        console.log('[ASIG] alumno gradoId=', gradoId, 'anioId=', anioId, 'total=', list.length);
        let filtered = list;
        if (anioId)  filtered = filtered.filter(a => a.anio?.idAnio === anioId);
        if (gradoId) filtered = filtered.filter(a => a.grado?.idGrado === gradoId);
        console.log('[ASIG] alumno filtrado=', filtered.length);
        return filtered;
      }),
      map(list => list.map(a => ({
        id: a.curso.idCurso,
        title: a.curso.nombre,
        coverUrl: a.curso.coverUrl || resolveCover(a.curso.nombre),
        teacherName: `${a.docente?.nombre ?? ''} ${a.docente?.apellido ?? ''}`.trim(),
      } satisfies UICourse)))
    );
  }

  private pickBadgeColor(gradeName?: string): UICourse['gradeColor'] {
    if (!gradeName) return 'emerald';
    const k = gradeName.toLowerCase();
    if (k.includes('2')) return 'emerald';
    if (k.includes('3')) return 'violet';
    if (k.includes('4')) return 'indigo';
    if (k.includes('5')) return 'cyan';
    if (k.includes('6')) return 'amber';
    return 'rose';
  }
}
