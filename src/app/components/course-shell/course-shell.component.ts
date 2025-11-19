// src/app/components/course-shell/course-shell.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { forkJoin, of } from 'rxjs';
import { catchError, finalize } from 'rxjs/operators';

// 👇 Asegúrate de que esta ruta sea la real de tu servicio
import { CourseContentService } from '../../services/course-content.service';

import {
  CursoHeaderDTO,
  UnidadDTO,
  SesionListItem,
  TareaListItem,
  AlumnoMini,
  UserMode
} from '../../models/course-content.model';

@Component({
  selector: 'app-course-shell',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './course-shell.component.html',
  styleUrls: ['./course-shell.component.css'],
})
export class CourseShellComponent implements OnInit {

  // ===== estado/UI =====
  mode: UserMode = 'teacher';
  tab: 'unidades' | 'companeros' = 'unidades';
  subtab: 'sesiones' | 'tareas' = 'sesiones';

  isLoading = true;
  errorMsg: string | null = null;

  // ===== datos =====
  header?: CursoHeaderDTO;
  unidades: UnidadDTO[] = [];
  companeros: AlumnoMini[] = [];
  sesiones: SesionListItem[] = [];
  tareas: TareaListItem[] = [];
  unidadSel?: UnidadDTO;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private api: CourseContentService,           // ✅ ahora sí existe
  ) {}

  ngOnInit(): void {
    // Rol desde LS para decidir si mostramos “Compañeros”
    try {
      const raw = localStorage.getItem('edurps_user');
      if (raw) {
        const u = JSON.parse(raw);
        const role = (u?.role || u?.rol || '').toString().toUpperCase();
        this.mode = role.includes('ESTUDIANTE') ? 'student' : 'teacher';
      }
    } catch { /* ignore */ }

    this.loadAll();
  }

  // ===================== Carga inicial =====================
  private loadAll(): void {
    const idCurso = Number(this.route.snapshot.paramMap.get('id'));
    if (!idCurso) { this.back(); return; }

    this.isLoading = true;
    this.errorMsg = null;

    const header$ = this.api.getCursoHeader(idCurso).pipe(
      catchError((err) => {
        this.errorMsg = this.msgFromErr(err, 'curso');
        return of(null as unknown as CursoHeaderDTO);
      })
    );

    const unidades$ = this.api.getUnidades(idCurso).pipe(
      catchError((err) => {
        this.errorMsg = this.msgFromErr(err, 'unidades');
        return of([] as UnidadDTO[]);
      })
    );

    const companeros$ = (this.mode === 'student'
      ? this.api.getCompaneros(idCurso)
      : of([] as AlumnoMini[])
    ).pipe(
      // nunca bloquea la carga por compañeros
      catchError(() => of([] as AlumnoMini[]))
    );

    forkJoin({ header: header$, unidades: unidades$, companeros: companeros$ })
      .pipe(finalize(() => (this.isLoading = false)))
      .subscribe(({ header, unidades, companeros }: {
        header: CursoHeaderDTO | null;
        unidades: UnidadDTO[];
        companeros: AlumnoMini[];
      }) => {
        this.header = header ?? undefined;
        this.unidades = Array.isArray(unidades) ? unidades : [];
        this.companeros = Array.isArray(companeros) ? companeros : [];

        if (!this.header) {
          this.errorMsg = this.errorMsg || 'No pudimos cargar el curso.';
          return;
        }

        if (this.unidades.length) {
          this.selectUnidad(this.unidades[0]);
        }

        if (this.mode === 'teacher') this.tab = 'unidades';
      });
  }

  retry(): void {
    this.loadAll();
  }

  // ===================== Navegación =====================
  back(): void {
    const base = this.mode === 'teacher' ? '/teacher-dashboard' : '/student-dashboard';
    this.router.navigate([base]);
  }

  openSesion(s: SesionListItem): void {
    if (!this.header) return;
    const base = this.mode === 'teacher' ? '/docente/curso' : '/estudiante/curso';
    this.router.navigate([`${base}/${this.header.idCurso}/sesion/${s.idSesion}`]);
  }

  // ===================== Tabs =====================
  changeTab(tab: 'unidades' | 'companeros'): void {
    this.tab = tab;
  }

  changeSubtab(sub: 'sesiones' | 'tareas'): void {
    if (this.subtab === sub) return;
    this.subtab = sub;
    if (this.unidadSel) this.selectUnidad(this.unidadSel);
  }

  // ===================== Por unidad =====================
  selectUnidad(u: UnidadDTO): void {
    this.unidadSel = u;

    if (this.subtab === 'sesiones') {
      this.api.getSesiones(u.idUnidad)
        .pipe(catchError(() => of([] as SesionListItem[])))
        .subscribe((list: SesionListItem[]) => {
          this.sesiones = Array.isArray(list) ? list : [];
        });
    } else {
      this.api.getTareas(u.idUnidad)
        .pipe(catchError(() => of([] as TareaListItem[])))
        .subscribe((list: TareaListItem[]) => {
          this.tareas = Array.isArray(list) ? list : [];
        });
    }
  }

  // ===================== Helper errores =====================
  private msgFromErr(err: any, ctx: string): string {
    const m = err?.error?.message || err?.message || String(err);
    console.error(`[${ctx}]`, err);
    return m;
  }
}
