// src/app/models/estudiante.model.ts

export interface Estudiante {
  idEstudiante?: number;
  usuario: {
    idUsuario?: number;
    nombre: string;
    apellido: string;
    email: string;
    telefono?: string;
    fechaNacimiento: string;
    rol?: string;
  };
  dni: string;
  codigoMatricula: string;
  grado?: {
    idGrado: number;
    nombre: string;
  };
  seccion?: {
    idSeccion: number;
    nombre: string;
  };
}

export interface EstudianteRequest {
  usuario: {
    nombre: string;
    apellido: string;
    email: string;
    telefono?: string;
    fechaNacimiento: string;
    password: string;
    rol: string;
  };
  dni: string;
  codigoMatricula: string;
  idGrado?: number;
  idSeccion?: number;
}

export interface EstudianteSearch {
  idEstudiante: number;
  nombreCompleto: string;
  dni: string;
  codigoMatricula: string;
  grado?: string;
  seccion?: string;
}