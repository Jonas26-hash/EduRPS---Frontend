// src/app/models/padre.model.ts

export interface Padre {
  idPadre?: number;
  usuario: {
    idUsuario?: number;
    nombre: string;
    apellido: string;
    email: string;
    telefono?: string;
    fechaNacimiento: string;
    rol?: string;
  };
  hijos?: Array<{
    idEstudiante: number;
    nombre: string;
    apellido: string;
  }>;
}

export interface PadreRequest {
  usuario: {
    nombre: string;
    apellido: string;
    email: string;
    telefono?: string;
    fechaNacimiento: string;
    password: string;
    rol: string;
  };
}

export interface PadreSearch {
  idPadre: number;
  nombreCompleto: string;
  email: string;
  telefono?: string;
  cantidadHijos: number;
}