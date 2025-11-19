export interface Vacante {
  idVacante?: number;
  grado: {
    idGrado: number;
    nombre: string;
  };
  seccion: {
    idSeccion: number;
    nombre: string;
  };
  cantidadTotal: number;
  cantidadDisponible: number;
  anioAcademico: number;
}

export interface VacanteRequest {
  idGrado: number;
  idSeccion: number;
  cantidadTotal: number;
  anioAcademico: number;
}