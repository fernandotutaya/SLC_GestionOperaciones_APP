export interface Company {
  _id?: string;
  nombreLegal: string;
  ruc: string;
  email: string;
  telefono: string;
  direccion: string;
  descripcion: string;
  companyName: string;
  companyPassword: string;
  plan: string;
  logoUrl: string;
  estado: boolean;
  sucursales: string[];
}
