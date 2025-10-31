// services/student.service.ts
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

export interface MenuItem {
  title: string;
  icon: string;
  route: string;
}

export interface StudentGrade {
  subject: string;
  grade: number;
  period: string;
  maxGrade: number;
}

export interface Attendance {
  date: string;
  status: 'present' | 'absent' | 'late';
  subject: string;
}

export interface Homework {
  id: string;
  subject: string;
  title: string;
  description: string;
  dueDate: string;
  status: 'pending' | 'in_progress' | 'completed' | 'overdue';
  priority: 'low' | 'medium' | 'high';
}

export interface ClassSchedule {
  time: string;
  monday?: string;
  tuesday?: string;
  wednesday?: string;
  thursday?: string;
  friday?: string;
}

@Injectable({
  providedIn: 'root'
})
export class StudentService {

  constructor() { }

  // Opciones del menú principal para estudiantes
  getStudentMenuItems(): Observable<MenuItem[]> {
    const menuItems: MenuItem[] = [
      {
        title: 'Portal del<br/>estudiante',
        icon: 'assets/Img/portal-estu.svg',
        route: '/student/portal'
      },
      {
        title: 'Asistencia',
        icon: 'assets/Img/Asis.svg',
        route: '/student/grades'
      },
      {
        title: 'Plan\nacademico',
        icon: 'assets/Img/Plan.svg',
        route: '/teacher/academic-plan'
      },
      {
        title: 'Biblioteca<br/>Electronica',
        icon: 'assets/Img/BiblioElec.svg',
        route: '/student/library'
      },
    ];

    return of(menuItems);
  }

  // Perfil del estudiante
  getStudentProfile(): Observable<any> {
    return of({
      name: 'Ana María García López',
      studentId: '2024001',
      role: 'Estudiante',
      grade: '3° Grado',
      section: 'A',
      profileImage: null,
      birthDate: '2014-05-15',
      guardian: 'Carlos García Mendoza'
    });
  }

  // Notas del estudiante por períodos
  getStudentGrades(): Observable<StudentGrade[]> {
    const grades: StudentGrade[] = [
      // 1er Bimestre
      { subject: 'Matemáticas', grade: 17, period: '1er Bimestre', maxGrade: 20 },
      { subject: 'Comunicación', grade: 16, period: '1er Bimestre', maxGrade: 20 },
      { subject: 'Ciencia y Tecnología', grade: 18, period: '1er Bimestre', maxGrade: 20 },
      { subject: 'Personal Social', grade: 15, period: '1er Bimestre', maxGrade: 20 },
      { subject: 'Educación Física', grade: 19, period: '1er Bimestre', maxGrade: 20 },
      { subject: 'Arte y Cultura', grade: 17, period: '1er Bimestre', maxGrade: 20 },
      { subject: 'Educación Religiosa', grade: 18, period: '1er Bimestre', maxGrade: 20 },
      
      // 2do Bimestre
      { subject: 'Matemáticas', grade: 16, period: '2do Bimestre', maxGrade: 20 },
      { subject: 'Comunicación', grade: 17, period: '2do Bimestre', maxGrade: 20 },
      { subject: 'Ciencia y Tecnología', grade: 19, period: '2do Bimestre', maxGrade: 20 },
      { subject: 'Personal Social', grade: 16, period: '2do Bimestre', maxGrade: 20 },
      { subject: 'Educación Física', grade: 18, period: '2do Bimestre', maxGrade: 20 },
      { subject: 'Arte y Cultura', grade: 18, period: '2do Bimestre', maxGrade: 20 },
      { subject: 'Educación Religiosa', grade: 19, period: '2do Bimestre', maxGrade: 20 }
    ];

    return of(grades);
  }

  // Asistencia del estudiante
  getStudentAttendance(): Observable<Attendance[]> {
    const attendance: Attendance[] = [
      { date: '2024-03-01', status: 'present', subject: 'Matemáticas' },
      { date: '2024-03-01', status: 'present', subject: 'Comunicación' },
      { date: '2024-03-01', status: 'present', subject: 'Ciencia y Tecnología' },
      { date: '2024-03-02', status: 'late', subject: 'Personal Social' },
      { date: '2024-03-02', status: 'present', subject: 'Educación Física' },
      { date: '2024-03-03', status: 'present', subject: 'Arte y Cultura' },
      { date: '2024-03-03', status: 'absent', subject: 'Educación Religiosa' },
      { date: '2024-03-04', status: 'present', subject: 'Matemáticas' },
      { date: '2024-03-04', status: 'present', subject: 'Comunicación' },
      { date: '2024-03-05', status: 'present', subject: 'Ciencia y Tecnología' }
    ];

    return of(attendance);
  }

  // Estadísticas del estudiante
  getStudentStats(): Observable<any> {
    return of({
      currentAverage: 16.7,
      previousAverage: 16.2,
      attendancePercentage: 95,
      totalClasses: 120,
      attendedClasses: 114,
      pendingHomework: 3,
      completedHomework: 18,
      upcomingExams: 2,
      bestSubject: 'Ciencia y Tecnología',
      improvementNeeded: 'Personal Social'
    });
  }

  // Tareas pendientes y completadas
  getAllHomework(): Observable<Homework[]> {
    const homework: Homework[] = [
      {
        id: '1',
        subject: 'Matemáticas',
        title: 'Ejercicios de fracciones',
        description: 'Resolver ejercicios del 1 al 20 de la página 45',
        dueDate: '2024-03-15',
        status: 'pending',
        priority: 'high'
      },
      {
        id: '2',
        subject: 'Comunicación',
        title: 'Ensayo sobre la primavera',
        description: 'Escribir un ensayo de 2 páginas sobre la estación primaveral',
        dueDate: '2024-03-18',
        status: 'in_progress',
        priority: 'medium'
      },
      {
        id: '3',
        subject: 'Ciencia y Tecnología',
        title: 'Informe del experimento',
        description: 'Elaborar informe sobre el experimento de germinación',
        dueDate: '2024-03-20',
        status: 'pending',
        priority: 'medium'
      },
      {
        id: '4',
        subject: 'Personal Social',
        title: 'Mapa del Perú',
        description: 'Dibujar y colorear mapa político del Perú con departamentos',
        dueDate: '2024-03-12',
        status: 'completed',
        priority: 'low'
      },
      {
        id: '5',
        subject: 'Arte y Cultura',
        title: 'Dibujo libre',
        description: 'Crear una obra artística con tema libre usando acuarelas',
        dueDate: '2024-03-25',
        status: 'pending',
        priority: 'low'
      }
    ];

    return of(homework);
  }

  // Horario de clases semanal
  getClassSchedule(): Observable<ClassSchedule[]> {
    const schedule: ClassSchedule[] = [
      { 
        time: '08:00 - 08:45', 
        monday: 'Matemáticas', 
        tuesday: 'Comunicación', 
        wednesday: 'Ciencia y Tecnología', 
        thursday: 'Personal Social', 
        friday: 'Arte y Cultura' 
      },
      { 
        time: '08:45 - 09:30', 
        monday: 'Comunicación', 
        tuesday: 'Matemáticas', 
        wednesday: 'Personal Social', 
        thursday: 'Ciencia y Tecnología', 
        friday: 'Educación Física' 
      },
      { 
        time: '09:30 - 10:15', 
        monday: '🍎 RECREO', 
        tuesday: '🍎 RECREO', 
        wednesday: '🍎 RECREO', 
        thursday: '🍎 RECREO', 
        friday: '🍎 RECREO' 
      },
      { 
        time: '10:15 - 11:00', 
        monday: 'Ciencia y Tecnología', 
        tuesday: 'Personal Social', 
        wednesday: 'Matemáticas', 
        thursday: 'Comunicación', 
        friday: 'Educación Religiosa' 
      },
      { 
        time: '11:00 - 11:45', 
        monday: 'Personal Social', 
        tuesday: 'Arte y Cultura', 
        wednesday: 'Educación Física', 
        thursday: 'Matemáticas', 
        friday: 'Comunicación' 
      },
      { 
        time: '11:45 - 12:30', 
        monday: 'Educación Física', 
        tuesday: 'Educación Religiosa', 
        wednesday: 'Arte y Cultura', 
        thursday: 'Educación Física', 
        friday: 'Ciencia y Tecnología' 
      }
    ];

    return of(schedule);
  }

  // Próximos exámenes
  getUpcomingExams(): Observable<any[]> {
    const exams = [
      {
        subject: 'Matemáticas',
        title: 'Examen de fracciones',
        date: '2024-03-22',
        time: '08:00',
        topics: ['Fracciones propias', 'Fracciones impropias', 'Operaciones básicas'],
        type: 'Práctica calificada'
      },
      {
        subject: 'Comunicación',
        title: 'Evaluación de comprensión lectora',
        date: '2024-03-25',
        time: '09:00',
        topics: ['Texto narrativo', 'Texto descriptivo', 'Vocabulario'],
        type: 'Examen bimestral'
      },
      {
        subject: 'Ciencia y Tecnología',
        title: 'Evaluación de experimentos',
        date: '2024-03-28',
        time: '10:15',
        topics: ['Método científico', 'Germinación', 'Estados de la materia'],
        type: 'Exposición grupal'
      }
    ];

    return of(exams);
  }

  // Recursos de biblioteca disponibles
  getLibraryResources(): Observable<any[]> {
    const resources = [
      {
        title: 'Cuentos Peruanos para Niños',
        author: 'Ricardo Palma',
        type: 'Libro',
        available: true,
        category: 'Literatura'
      },
      {
        title: 'Matemáticas Divertidas - 5to Grado',
        author: 'Editorial Santillana',
        type: 'Libro de texto',
        available: true,
        category: 'Matemáticas'
      },
      {
        title: 'Atlas del Perú',
        author: 'Instituto Geográfico Nacional',
        type: 'Atlas',
        available: false,
        category: 'Geografía'
      },
      {
        title: 'Experimentos Caseros',
        author: 'Dr. Science',
        type: 'Video educativo',
        available: true,
        category: 'Ciencias'
      }
    ];

    return of(resources);
  }

  // Calcular promedio por período
  getAverageByPeriod(period: string): Observable<number> {
    return new Observable(observer => {
      this.getStudentGrades().subscribe(grades => {
        const periodGrades = grades.filter(g => g.period === period);
        const average = periodGrades.reduce((sum, grade) => sum + grade.grade, 0) / periodGrades.length;
        observer.next(Math.round(average * 10) / 10);
        observer.complete();
      });
    });
  }

  // Obtener tareas por estado
  getHomeworkByStatus(status: 'pending' | 'in_progress' | 'completed' | 'overdue'): Observable<Homework[]> {
    return new Observable(observer => {
      this.getAllHomework().subscribe(homework => {
        const filtered = homework.filter(h => h.status === status);
        observer.next(filtered);
        observer.complete();
      });
    });
  }

  // Marcar tarea como completada
  markHomeworkAsCompleted(homeworkId: string): Observable<boolean> {
    return new Observable(observer => {
      // Aquí harías la llamada a tu API real
      console.log(`Marking homework ${homeworkId} as completed`);
      observer.next(true);
      observer.complete();
    });
  }
}