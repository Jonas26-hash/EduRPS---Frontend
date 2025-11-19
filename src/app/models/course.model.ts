export type UserMode = 'teacher' | 'student';

export interface Course {
  id: number;
  title: string;

  // Para docentes: se muestra el grado
  grade?: string;

  // Color del chip de grado (solo docentes)
  gradeColor?: 'emerald' | 'indigo' | 'amber' | 'rose' | 'cyan' | 'violet'; // color auxiliar usado en la vista (p. ej. 'emerald', 'indigo', ...)

  // Para estudiantes: se muestra el nombre del docente
  teacherName?: string;

  // Etiqueta bajo el título
  roleBadge: 'Docente' | 'Estudiante';

  // Imagen de portada
  coverUrl?: string;
}
