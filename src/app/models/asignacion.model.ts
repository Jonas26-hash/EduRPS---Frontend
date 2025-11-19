// Lo que devuelve tu endpoint /api/asignacioncurso
export interface AsignacionCursoDTO {
  idAsignacion: number;
  docente: { idDocente: number; nombre: string; apellido: string };
  curso:   { idCurso: number;  nombre: string; descripcion?: string; coverUrl?: string; coverKey?: string };
  grado:   { idGrado: number;  nombre: string };
  anio?:   { idAnio: number;    nombre: string }; // <- si ya lo agregaste
  fechaAsignacion: string; // "YYYY-MM-DD"
}

// El modelo de la UI (no cambia tu HTML/CSS)
export type UserMode = 'teacher' | 'student';
export interface UICourse {
  id: number | string;
  title: string;
  coverUrl?: string;
  grade?: string;                // solo docente
  gradeColor?: 'emerald'|'indigo'|'amber'|'rose'|'cyan'|'violet';
  teacherName?: string;          // solo estudiante
}
