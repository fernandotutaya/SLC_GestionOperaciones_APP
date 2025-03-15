// Mejoras en los tipos para alineación con API
export interface ProcesoDetail {
    numOrden: string;
    maquina: string; // Cambiar a string (ID máquina)
    cantPrendas: number;
    etiqueta?: string;
    observaciones?: string;
  }
  
  export interface Proceso {
    _id: string;
    tipo: string;
    fecha: string;
    hora: string;
    responsable: {
      _id: string;
      nombreCompleto: string;
      puesto?: string;
    };
    detalles: ProcesoDetail[];
    estado: boolean;
    operacionId: string; // Nueva propiedad
    createdAt: string;
    nextStage: string;
  }
  
  export interface Operacion {
    _id: string;
    fecInicio: string;
    fecFinal: string;
    estadoOperacion: boolean;
    currentStage: string;
    nextStage: string;
    procesos: Proceso[];
    sucursalId: string;
    companyId: string;
  }