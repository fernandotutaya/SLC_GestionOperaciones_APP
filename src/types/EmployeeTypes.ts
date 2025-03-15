// types/employee.ts
export interface Address {
  calle: string;
  ciudad: string;
  provincia: string;
  codigoPostal: string;
}

export interface Employee {
  _id?: string;
  apellidos: string;
  nombres: string;
  dni: string;
  fechaNacimiento: Date;
  genero: string;
  email: string;
  telefonoPrincipal: string;
  telefonoSecundario?: string;
  puesto: string;
  areaTrabajo: string;
  tipoContrato: string;
  fechaIngreso: Date;
  salario: number;
  direccion: Address;
  activo: boolean;
  estadoCivil: string;
}

export interface EmployeeFilters {
  sucursal?: string;
  areaTrabajo?: string;
}

export interface ApiResponse<T> {
  errors: Array<string>;
  message: string;
  empleado?: T;
}