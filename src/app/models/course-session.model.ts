export type TipoRecurso = 'Guía'|'Presentación'|'Video'|'Lectura'|'Práctica'|'Interactivo'|'Otro';

export interface SesionDTO {
  idSesion: number;
  numero: number;
  titulo: string;
  fecha: string;          // ISO date
  descripcion?: string;

  idUnidad: number;
  idCurso: number;
  unidadNombre: string;
  cursoNombre: string;

  anioId: number;
  anioNombre: string;
}

export interface RecursoDTO {
  idRecurso: number;
  idSesion: number;
  tipo: TipoRecurso;
  titulo: string;
  url?: string;
  archivoKey?: string;
  orden: number;
  createdAt: string;
}

export interface TareaDTO {
  idTarea: number;
  idSesion: number;
  titulo: string;
  descripcion?: string;
  fechaEntrega: string; // ISO date
  publicada: boolean;
  orden: number;
  createdAt: string;
}

/** Vista combinada para el detalle de sesión (recursos + tareas) */
export interface SesionDetalle {
  sesion: SesionDTO;
  recursos: RecursoDTO[];
  tareas: TareaDTO[];
}
