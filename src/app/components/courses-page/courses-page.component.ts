import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';

import { ConfigModalComponent } from '../config-modal/config-modal.component';
import { HelpModalComponent } from '../help-modal/help-modal.component';

import { SettingsService, AppSettings } from '../../services/settings.service';
import { CoursesService } from '../../services/courses.service';
import { UICourse, UserMode } from '../../models/asignacion.model';

type TaskCategory = 'pendiente' | 'completado' | 'atrasado' | 'todas';

interface TaskItem {
  title: string;
  course: string;
  deadline: string;
  categoria: TaskCategory;
}

@Component({
  selector: 'app-courses-page',
  standalone: true,
  imports: [CommonModule, ConfigModalComponent, HelpModalComponent],
  templateUrl: './courses-page.component.html',
  styleUrls: ['./courses-page.component.css'],
})
export class CoursesPageComponent implements OnInit {
  // ===== Modo (teacher/student) =====
  mode: UserMode = 'teacher';
  get isStudent() { return this.mode === 'student'; }
  get isTeacher() { return this.mode === 'teacher'; }

  // ===== UI =====
  sidebarOpen = false;
  active: 'courses' | 'horario' | 'notas' = 'courses';

  userName = '';
  schoolName = '';
  photoUrl = '';
  avatarInitial = '';

  courses: UICourse[] = [];
  isLoading = true;

  // ===== Tareas panel derecho =====
  taskFilter: TaskCategory = 'todas';
  tasks: TaskItem[] = [];
  get tasksView(): TaskItem[] {
    if (this.isTeacher) {
      return this.taskFilter === 'todas' ? this.tasks : this.tasks.filter(t => t.categoria === 'pendiente');
    }
    return this.tasks.filter(t => t.categoria === this.taskFilter);
  }

  // ===== Modales =====
  configOpen = false;
  helpOpen = false;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private settingsService: SettingsService,
    private coursesSrv: CoursesService
  ) {}

  ngOnInit(): void {
    // Si definiste data.mode en la ruta, úsalo como valor por defecto.
    const routeMode = (this.route.snapshot.data?.['mode'] as UserMode | undefined);
    if (routeMode) this.mode = routeMode;

    this.settingsService.loadFromStorage();

    // ==== Cargar usuario local ====
    const raw = localStorage.getItem('edurps_user');

    let docenteId: number | undefined;
    let gradoId: number | undefined;
    let anioId: number | undefined;

    if (raw) {
      try {
        const u = JSON.parse(raw);

        // Nombre/colegio/avatar
        const name = `${u.nombre || u.name || ''} ${u.apellido || u.lastName || ''}`.trim();
        this.userName = name || 'Usuario';
        this.schoolName = u.schoolName || 'I.E. Ricardo Palma Soriano';
        this.photoUrl = u.photoUrl || '';
        this.avatarInitial = (this.userName?.[0] || 'U').toUpperCase();

        // Rol
        const role = (u.role || u.rol || '').toString().toUpperCase();
        if (role.includes('ESTUDIANTE')) this.mode = 'student';
        if (role.includes('DOCENTE'))    this.mode = 'teacher';

        // Docente id – buscamos en varias rutas típicas
        const candidates = [
          u.idDocente,
          u.docenteId,
          u?.docente?.idDocente,
          u?.docente?.id,
          u?.usuario?.docente?.idDocente,
          u?.usuario?.docente?.id,
          u?.usuario?.idDocente,
          u?.id,              // a veces el id del usuario es también id del docente
          u?.usuario?.id,
          u?.userId,
        ];
        const candidate = candidates.find(v => v !== undefined && v !== null);
        if (candidate !== undefined && candidate !== null) {
          docenteId = typeof candidate === 'string' && /^\d+$/.test(candidate) ? Number(candidate) : candidate;
        }

        // Para estudiantes
        gradoId = u.idGrado
               ?? u.gradoId
               ?? u?.grado?.idGrado
               ?? u?.estudiante?.grado?.idGrado
               ?? undefined;

        // Año opcional
        anioId = u.idAnio
              ?? u.anioId
              ?? u?.anio?.idAnio
              ?? undefined;

        // console.log({ role, docenteId, gradoId, anioId });
      } catch (e) {
        console.warn('No se pudo parsear edurps_user', e);
      }
    }

    // Filtro inicial de tareas
    this.taskFilter = this.isTeacher ? 'todas' : 'pendiente';

    // ==== Cargar cursos según rol ====
    if (this.isTeacher) {
      if (docenteId) {
        this.coursesSrv.getTeacherCourses(docenteId, anioId).subscribe({
          next: list => { this.courses = list; this.isLoading = false; },
          error: err => { console.error('Docente cursos', err); this.isLoading = false; }
        });
      } else {
        console.warn('No hay idDocente en el usuario logueado');
        this.courses = [];
        this.isLoading = false;
      }
    } else {
      this.coursesSrv.getStudentCourses(gradoId, anioId).subscribe({
        next: list => { this.courses = list; this.isLoading = false; },
        error: err => { console.error('Estudiante cursos', err); this.isLoading = false; }
      });
    }

    // ==== Tareas de ejemplo (placeholder) ====
    if (this.isStudent) {
      this.tasks = [
        { title: 'Ejercicios de fracciones',  course: 'Matemática', deadline: '15 de Mayo', categoria: 'pendiente'  },
        { title: 'Análisis de texto',         course: 'Lenguaje',   deadline: '12 de Mayo', categoria: 'atrasado'   },
        { title: 'Investigación ecosistemas', course: 'Ciencias',   deadline: '20 de Mayo', categoria: 'pendiente'  },
        { title: 'Línea de tiempo',           course: 'Historia',   deadline: '10 de Mayo', categoria: 'completado' },
      ];
    } else {
      this.tasks = [
        { title: 'Revisión de exámenes finales', course: 'Lenguaje',   deadline: '14 de Mayo', categoria: 'pendiente'  },
        { title: 'Corregir trabajos grupales',   course: 'Ciencias',   deadline: '10 de Mayo', categoria: 'atrasado'   },
        { title: 'Registrar notas parciales',    course: 'Matemática', deadline: '17 de Mayo', categoria: 'pendiente'  },
        { title: 'Revisión de informes',         course: 'Historia',   deadline: '9 de Mayo',  categoria: 'completado' },
      ];
    }
  }

  // ===== Interacciones UI =====
  toggleSidebar() { this.sidebarOpen = !this.sidebarOpen; }
  closeSidebar()   { this.sidebarOpen = false; }
  setTab(tab: 'courses'|'horario'|'notas') { this.active = tab; }

  // ===== Navegación =====
  openCourse(c: UICourse) {
    const base = this.isTeacher ? '/docente/curso' : '/estudiante/curso';
    this.router.navigate([base, c.id]);
  }

  back() {
    const base = this.isTeacher ? '/teacher-dashboard' : '/student-dashboard';
    this.router.navigate([base]);
  }

  // ===== Modales =====
  openConfig() { this.configOpen = true; }
  onConfigClose() { this.configOpen = false; }
  onSettingsChanged(s: AppSettings) { this.settingsService.save(s); }

  openHelp(){ this.helpOpen = true; }
}
