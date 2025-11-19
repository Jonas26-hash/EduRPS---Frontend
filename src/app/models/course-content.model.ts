export type UserMode = 'teacher' | 'student';

export interface CursoHeaderDTO {
  idCurso: number;
  titulo: string;
  grado: string;          // “5° Primaria” p.ej.
  anio: string;           // “2025”
  coverUrl?: string;
}

export interface UnidadDTO {
  idUnidad: number;
  numero: number;
  nombre: string;
}

export interface SesionListItem {
  idSesion: number;
  numero: number;
  titulo: string;
  fecha?: string;         // ISO date
  resumen?: string;       // 1–2 líneas para la card
  duracionMin?: number;   // opcional, para el chip “185min”
}

export interface TareaListItem {
  idTarea: number;
  titulo: string;
  fechaEntrega: string;   // ISO date
  publicada: boolean;
  estado?: 'pendiente' | 'entregada' | 'calificada';
}

export type TipoRecurso = 'Guía'|'Presentación'|'Video'|'Lectura'|'Práctica'|'Interactivo'|'Otro';

export interface Recurso {
  idRecurso: number;
  titulo: string;
  tipo: TipoRecurso;
  url?: string;
}

export interface SesionDetalle {
  idSesion: number;
  numero: number;
  titulo: string;
  fecha?: string;
  descripcion?: string;

  // bloques tipo “U / E / A / C” (puedes renderizar estático al inicio y solo
  // poblar los recursos con etiquetas)
  recursos: Recurso[];
  tareas: TareaListItem[];
}

export interface AlumnoMini {
  idEstudiante: number;
  nombre: string;
  apellido: string;
  avatarUrl?: string;
}
