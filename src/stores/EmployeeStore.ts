// stores/employeeStore.ts
import { defineStore } from 'pinia';
import axios from 'axios';
import type { Employee, EmployeeFilters, ApiResponse } from '@/types/EmployeeTypes';
import { useAuthStore } from '@/stores/AuthStore';

const API_BASE_URL = process.env.VITE_BASE_API;

export const useEmployeeStore = defineStore('employee', {
  state: () => ({
    employees: [] as Employee[],
    currentEmployee: null as Employee | null,
    loading: false,
    error: null as string | null,
    initialized: false // Track if the store has been initialized
  }),

  actions: {
    // Initialize the store - loads employees automatically
    async initialize() {
      if (!this.initialized && !this.loading) {
        await this.fetchEmployees({});
        this.initialized = true;
      }
      return this.employees;
    },

    async createEmployee(employee: Employee): Promise<void> {
      const authStore = useAuthStore();
      try {
        this.loading = true;
        const response = await axios.post<ApiResponse<Employee>>(
          `${API_BASE_URL}/${authStore.company?._id}/empleado/${authStore.sucursal?._id}`,
          employee
        );
        if (response.data.empleado) {
          this.employees.push(response.data.empleado);
        }
        if (response.data?.errors) {
          this.error = response.data.message;
        }
      } catch (error) {
        this.error = 'Error al crear empleado';
        console.log('Error al crear empleado', error);
        throw error;
      } finally {
        this.loading = false;
      }
    },

    async fetchEmployees(filters: EmployeeFilters = {}): Promise<void> {
      const authStore = useAuthStore();
      try {
        this.loading = true;
        const params = new URLSearchParams();
        if (filters.sucursal) params.append('sucursal', filters.sucursal);
        if (filters.areaTrabajo) params.append('areaTrabajo', filters.areaTrabajo);

        const response = await axios.get<Employee[]>(
          `${API_BASE_URL}/${authStore.company?._id}/empleado`,
          { params }
        );
        this.employees = response.data;
        console.log('EMPLEADOS', this.employees); 
      } catch (error) {
        console.log('Error al obtener empleados', error);
        throw error;
      } finally {
        this.loading = false;
      }
    },

    async getEmployeeById(employeeId: string): Promise<void> {
      const authStore = useAuthStore();
      try {
        this.loading = true;
        const response = await axios.get<Employee>(
          `${API_BASE_URL}/${authStore.company?._id}/empleado/${employeeId}`
        );
        this.currentEmployee = response.data;
      } catch (error) {
        this.error = 'Error al obtener empleado';
        throw error;
      } finally {
        this.loading = false;
      }
    },

    async updateEmployee(employeeId: string, updates: Partial<Employee>): Promise<void> {
      const authStore = useAuthStore();
      try {
        this.loading = true;
        await axios.put<ApiResponse<never>>(
          `${API_BASE_URL}/${authStore.company?._id}/empleado/${employeeId}`,
          updates
        );
        if (this.currentEmployee && this.currentEmployee._id === employeeId) {
          this.currentEmployee = { ...this.currentEmployee, ...updates };
        }
      } catch (error) {
        this.error = 'Error al actualizar empleado';
        throw error;
      } finally {
        this.loading = false;
      }
    },

    async deleteEmployee(employeeId: string): Promise<void> {
      const authStore = useAuthStore();
      try {
        this.loading = true;
        await axios.delete<ApiResponse<never>>(
          `${API_BASE_URL}/${authStore.company?._id}/empleado/${employeeId}`
        );
        this.employees = this.employees.filter(emp => emp._id !== employeeId);
      } catch (error) {
        this.error = 'Error al eliminar empleado';
        throw error;
      } finally {
        this.loading = false;
      }
    },
  },
});