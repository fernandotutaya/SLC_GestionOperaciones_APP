export interface Machine {
  _id?: string;
  tipo: string;
  modelo: string;
  marca: string;
  codigoFabrica: string;
  nombreMaquina: string;
  caracteristicas: {
    capacidad: number;
    unidadCapacidad: string;
    consumoEnergetico: number;
    dimensiones: {
      alto: number;
      ancho: number;
      profundidad: number;
    };
  };
  fechaInstalacion: Date;
  ultimoMantenimiento: {
    fecha: Date;
    descripcion: string;
    tecnico: string;
  };
  proximoMantenimiento: Date;
  horasUso: number;
}

export interface MaquinaFilters {
  tipo?: string;
  sucursal?: string;
  search?: string;
}

export interface ApiResponse<T> {
  errors: Array<string>;
  message: string;
  maquina?: T;
}
