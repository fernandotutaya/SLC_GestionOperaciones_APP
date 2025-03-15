import { defineStore } from 'pinia';
import axios from 'axios';
import type { Machine, MaquinaFilters, ApiResponse } from '@/types/MachineTypes';
import { useAuthStore } from '@/stores/AuthStore';

const API_BASE_URL = process.env.VITE_BASE_API;

export const useMachineStore = defineStore('MachineStore', {
  state: () => ({
    maquinas: [] as Machine[],
    currentMaquina: null as Machine | null,
    loading: false,
    error: null as string | null,
  }),

  actions: {
    async createMaquina(maquina: Machine): Promise<void> {
      const authStore = useAuthStore();
      try {
        this.loading = true;
        const response = await axios.post<ApiResponse<Machine>>(
          `${API_BASE_URL}/${authStore.company?._id}/maquinas/${authStore.sucursal?._id}`,
          maquina
        );
        if (response.data.maquina) {
          this.maquinas.push(response.data.maquina);
        }
        if (response.data?.errors) {
          this.error = response.data.message;
        }
      } catch (error) {
        this.error = 'Error al crear máquina';
        console.log('Error al crear máquina', error);
        throw error;
      } finally {
        this.loading = false;
      }
    },

    async fetchMachines(filters: MaquinaFilters): Promise<void> {
      const authStore = useAuthStore();
      try {
        this.loading = true;
        const params = new URLSearchParams();
        if (filters.tipo) params.append('tipo', filters.tipo);
        if (filters.sucursal) params.append('sucursal', filters.sucursal);

        const response = await axios.get<Machine[]>(
          `${API_BASE_URL}/${authStore.company?._id}/maquinas`,
          { params }
        );
        this.maquinas = response.data;
        console.log(response.data)
      } catch (error) {
        console.log('Error al obtener máquinas', error);
        throw error;
      } finally {
        this.loading = false;
      }
    },

    async getMaquinaById(maquinaId: string): Promise<void> {
      const authStore = useAuthStore();
      try {
        this.loading = true;
        const response = await axios.get<Machine>(
          `${API_BASE_URL}/${authStore.company?._id}/maquinas/${maquinaId}`
        );
        this.currentMaquina = response.data;
      } catch (error) {
        this.error = 'Error al obtener máquina';
        throw error;
      } finally {
        this.loading = false;
      }
    },

    async updateMaquina(maquinaId: string, updates: Partial<Machine>): Promise<void> {
      const authStore = useAuthStore();
      try {
        this.loading = true;
        await axios.put<ApiResponse<never>>(
          `${API_BASE_URL}/${authStore.company?._id}/maquinas/${maquinaId}`,
          updates
        );
        if (this.currentMaquina && this.currentMaquina._id === maquinaId) {
          this.currentMaquina = { ...this.currentMaquina, ...updates };
        }
      } catch (error) {
        this.error = 'Error al actualizar máquina';
        throw error;
      } finally {
        this.loading = false;
      }
    },

    async deleteMaquina(maquinaId: string): Promise<void> {
      const authStore = useAuthStore();
      try {
        this.loading = true;
        await axios.delete<ApiResponse<never>>(
          `${API_BASE_URL}/${authStore.company?._id}/maquinas/${maquinaId}`
        );
        this.maquinas = this.maquinas.filter(maq => maq._id !== maquinaId);
      } catch (error) {
        this.error = 'Error al eliminar máquina';
        throw error;
      } finally {
        this.loading = false;
      }
    },
  },
});
