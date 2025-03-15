export interface Sucursal {
  _id?: string;
  nombreSucursal: string;
  direccion: string;
  telefono: string;
  telefonoCodigoPais: string;
  email: string;
  estado: boolean;
  horarioAtencion: {
    apertura: string;
    cierre: string;
  };
  ubicacionGPS: {
    latitude: number;
    longitude: number;
  };
  capacidadMaxima: number;
  maquinas: string[];
  encargado: {
    nombre: string;
    telefono: string;
    telefonoCodigoPais: string;
    email: string;
  };
}
