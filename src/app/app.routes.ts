import { Routes } from '@angular/router';

import { LoginComponent } from './components/login/login.component';
import { TeacherDashboardComponent } from './components/teacher-dashboard/teacher-dashboard.component';
import { StudentDashboardComponent } from './components/student-dashboard/student-dashboard.component';
import { CourseShellComponent } from './components/course-shell/course-shell.component';
import { SessionDetailComponent } from './components/session-detail/session-detail.component';

import { authGuard } from './guards/auth.guard';
import { roleGuard } from './guards/role.guard';

export const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'login' },
  { path: 'login', component: LoginComponent },

  // Dashboards
  {
    path: 'teacher-dashboard',
    component: TeacherDashboardComponent,
    canActivate: [authGuard, roleGuard],
    data: { roles: ['DOCENTE', 'DIRECTOR', 'ADMIN'] }
  },
  { path: 'director-dashboard', redirectTo: 'teacher-dashboard' },

  {
    path: 'student-dashboard',
    component: StudentDashboardComponent,
    canActivate: [authGuard, roleGuard],
    data: { roles: ['ESTUDIANTE'] }
  },

  // Listado de cursos (misma pantalla para ambos, con data.mode)
  {
    path: 'docente/cursos',
    canActivate: [authGuard, roleGuard],
    data: { roles: ['DOCENTE', 'DIRECTOR', 'ADMIN'], mode: 'teacher' },
    loadComponent: () =>
      import('./components/courses-page/courses-page.component')
        .then(m => m.CoursesPageComponent)
  },
  {
    path: 'estudiante/cursos',
    canActivate: [authGuard, roleGuard],
    data: { roles: ['ESTUDIANTE'], mode: 'student' },
    loadComponent: () =>
      import('./components/courses-page/courses-page.component')
        .then(m => m.CoursesPageComponent)
  },

  // Vista de un curso (banner+tabs+rail)
  {
    path: 'docente/curso/:id',
    component: CourseShellComponent,
    canActivate: [authGuard, roleGuard],
    data: { roles: ['DOCENTE', 'DIRECTOR', 'ADMIN'], mode: 'teacher' }
  },
  {
    path: 'estudiante/curso/:id',
    component: CourseShellComponent,
    canActivate: [authGuard, roleGuard],
    data: { roles: ['ESTUDIANTE'], mode: 'student' }
  },

  // Detalle de sesión (ambos modos)
  {
    path: 'docente/curso/:id/sesion/:ids',
    component: SessionDetailComponent,
    canActivate: [authGuard, roleGuard],
    data: { roles: ['DOCENTE', 'DIRECTOR', 'ADMIN'], mode: 'teacher' }
  },
  {
    path: 'estudiante/curso/:id/sesion/:ids',
    component: SessionDetailComponent,
    canActivate: [authGuard, roleGuard],
    data: { roles: ['ESTUDIANTE'], mode: 'student' }
  },

  // ========== MÓDULO DE MATRÍCULA ==========
  {
    path: 'admin/matriculas',
    canActivate: [authGuard, roleGuard],
    data: { roles: ['DIRECTOR', 'ADMIN'] },
    loadChildren: () => 
      import('./matricula.module')
        .then(m => m.MatriculaModule)
  },
  
  { path: '**', redirectTo: 'login' }
];