// src/app/models/matricula.model.ts

export interface Matricula {
  idMatricula?: number;
  codigoMatricula: string;
  anioAcademico: number;
  fechaMatricula: string;
  estado: EstadoMatricula;
  observaciones?: string;
  estudiante: {
    idEstudiante: number;
    nombre?: string;
    apellido?: string;
    dni?: string;
  };
  grado: {
    idGrado: number;
    nombre?: string;
  };
  seccion: {
    idSeccion: number;
    nombre?: string;
  };
  padre?: {
    idPadre: number;
    nombre?: string;
    apellido?: string;
  };
  vacante?: {
    idVacante: number;
  };
}

export enum EstadoMatricula {
  MATRICULADO = 'MATRICULADO',
  PENDIENTE = 'PENDIENTE',
  ANULADO = 'ANULADO'
}

export interface MatriculaRequest {
  codigoMatricula: string;
  anioAcademico: number;
  fechaMatricula: string;
  estado: EstadoMatricula;
  observaciones?: string;
  idEstudiante: number;
  idGrado: number;
  idSeccion: number;
  idPadre?: number;
  idVacante?: number;
}

export interface MatriculaFilter {
  nombreEstudiante?: string;
  anioAcademico?: number;
  idGrado?: number;
  estado?: EstadoMatricula;
}