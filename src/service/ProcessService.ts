import axios from 'axios';
import { useAuthStore } from '@/stores/AuthStore';

interface ProcessDetail {
  numOrden: string;
  maquina: string; // ID de la máquina
  cantPrendas: number;
  etiqueta?: string;
  observaciones?: string;
}

interface ProcessPayload {
  tipo: string;
  fecha: string;
  hora?: string;
  responsable: string;
  detalles: ProcessDetail[];
  nextStage?: string;
}

export class ProcessService {
  private static getBaseUrl() {
    const authStore = useAuthStore();
    return `http://localhost:8080/api/${authStore.company?._id}/operaciones/${authStore.sucursal?._id}`;
  }

  static async getProcesses(filters = {}, page = 1, limit = 10) {
    console.log(this.getBaseUrl()); 

    const response = await axios.get(`${this.getBaseUrl()}/procesos/filter`, {
      params: { ...filters, page, limit }
    });
    return response.data;
  }

  static async createProcess(payload: any) {
    const response = await axios.post(this.getBaseUrl(), payload);
    
    // Crear operación predeterminada si hay nextStage
    if (payload.nextStage) {
      await this.createDefaultOperation(payload.nextStage);
    }
    
    return response.data;
  }

  static async updateProcess(id: string, process: any) { // Add updateProcess method
    return axios.put(`/api/processes/${id}`, process);
  }

  static async deleteProcess(processId: string) {
    const authStore = useAuthStore();
    const response = await axios.delete(
      `http://localhost:8080/api/${authStore.company?._id}/operaciones/${authStore.sucursal?._id}/procesos/${processId}`
    );
    return response.data;
  }

  private static async createDefaultOperation(nextStage: string) {
    await axios.post(this.getBaseUrl(), {
      tipo: nextStage,
      detalles: [],
      estado: false
    });
  }

  static async getMachines() {
    const authStore = useAuthStore();
    return axios.get(`http://localhost:8080/api/${authStore.company?._id}/maquinas`);
  }

  static async getResponsables() {
    const authStore = useAuthStore();
    return axios.get(`http://localhost:8080/api/${authStore.company?._id}/empleado`);
  }
}