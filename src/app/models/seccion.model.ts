export interface Seccion {
  idSeccion: number;
  nombre: string;
  grado: {
    idGrado: number;
    nombre: string;
  };
  capacidadMaxima: number;
  estudiantesActuales?: number;
}
