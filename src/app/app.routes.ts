// app.routes.ts (ACTUALIZADO CON RUTAS DE ESTUDIANTES)
import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { TeacherDashboardComponent } from './components/teacher-dashboard/teacher-dashboard.component';
import { StudentDashboardComponent } from './components/student-dashboard/student-dashboard.component';

export const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  
  // Rutas del docente
  { path: 'teacher-dashboard', component: TeacherDashboardComponent },
  { path: 'teacher/portal', component: TeacherDashboardComponent },
  { path: 'teacher/attendance', component: TeacherDashboardComponent },
  { path: 'teacher/academic-plan', component: TeacherDashboardComponent },
  { path: 'teacher/library', component: TeacherDashboardComponent },
  
  // Rutas del estudiante
  { path: 'student-dashboard', component: StudentDashboardComponent },
  { path: 'student/portal', component: StudentDashboardComponent },
  { path: 'student/grades', component: StudentDashboardComponent },
  { path: 'student/schedule', component: StudentDashboardComponent },
  { path: 'student/homework', component: StudentDashboardComponent },
  { path: 'student/library', component: StudentDashboardComponent },
  { path: 'student/attendance', component: StudentDashboardComponent },
  
  // Ruta por defecto
  { path: '**', redirectTo: '/login' }
];