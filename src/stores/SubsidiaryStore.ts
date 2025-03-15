import { defineStore } from 'pinia';
import axios from 'axios';
import type { Sucursal } from '@/types/SubsidiaryTypes';
import { useAuthStore } from '@/stores/AuthStore';

const API_BASE_URL = process.env.VITE_BASE_API;

export const useSucursalStore = defineStore('sucursal', {
  state: () => ({
    sucursales: [] as Sucursal[],
    currentSucursal: null as Sucursal | null,
    loading: false,
    error: null as string | null,
  }),
  actions: {
    async fetchSucursales(): Promise<void> {
      const authStore = useAuthStore();
      try {
        this.loading = true;
        const response = await axios.get<Sucursal[]>(
          `${API_BASE_URL}/${authStore.company?._id}/sucursales`
        );
        this.sucursales = response.data;
      } catch (error) {
        console.log('Error al obtener sucursales', error);
        throw error;
      } finally {
        this.loading = false;
      }
    },
    async getSucursalById(id: string): Promise<void> {
      const authStore = useAuthStore();
      try {
        this.loading = true;
        const response = await axios.get<Sucursal>(
          `${API_BASE_URL}/${authStore.company?._id}/sucursales/${id}`
        );
        this.currentSucursal = response.data;
      } catch (error) {
        this.error = 'Error al obtener sucursal';
        throw error;
      } finally {
        this.loading = false;
      }
    },
    async createSucursal(sucursal: Sucursal): Promise<void> {
      const authStore = useAuthStore();
      try {
        this.loading = true;
        await axios.post(
          `${API_BASE_URL}/${authStore.company?._id}/sucursales`,
          sucursal
        );
        await this.fetchSucursales();
      } catch (error) {
        this.error = 'Error al crear sucursal';
        throw error;
      } finally {
        this.loading = false;
      }
    },
    async updateSucursal(id: string, sucursal: Sucursal): Promise<void> {
      const authStore = useAuthStore();
      try {
        this.loading = true;
        await axios.put(
          `${API_BASE_URL}/${authStore.company?._id}/sucursales/${id}`,
          sucursal
        );
        await this.fetchSucursales();
      } catch (error) {
        this.error = 'Error al actualizar sucursal';
        throw error;
      } finally {
        this.loading = false;
      }
    },
    async deleteSucursal(id: string): Promise<void> {
      const authStore = useAuthStore();
      try {
        this.loading = true;
        await axios.delete(
          `${API_BASE_URL}/${authStore.company?._id}/sucursales/${id}`
        );
        this.sucursales = this.sucursales.filter(suc => suc._id !== id);
      } catch (error) {
        this.error = 'Error al eliminar sucursal';
        throw error;
      } finally {
        this.loading = false;
      }
    },
  },
});
