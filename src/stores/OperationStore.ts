// stores/operacionStore.ts
import { defineStore } from 'pinia';
import axios from 'axios';
import { useAuthStore } from '@/stores/AuthStore';
import type { Operacion, 
  OperacionFilters, 
  Proceso, 
  ApiResponse, 
  ProcesoResponse, 
  OperacionResponse, 
  SingleOperacionResponse, ProcesoFilters, 
  NewProceso, 
  NewOperacion } from '@/types/OperationTypes';

const API_BASE_URL = process.env.VITE_BASE_API;

export const useOperationStore = defineStore('OperationStore', {
  state: () => ({
    operaciones: [] as Operacion[],
    currentOperacion: null as Operacion | null,
    loading: false,
    error: null as string | null,
  }),
  actions: {
    async fetchOperaciones(filters: OperacionFilters = {}) {
      const authStore = useAuthStore();
      try {
        this.loading = true;
        const params = new URLSearchParams();
        if (filters.estadoOperacion) params.append('estadoOperacion', filters.estadoOperacion.toString());
        if (filters.page) params.append('page', filters.page.toString());
        if (filters.limit) params.append('limit', filters.limit.toString());

        const response = await axios.get<ApiResponse<OperacionResponse>>(
          `${API_BASE_URL}/api/${authStore.company?._id}/operaciones/${authStore.sucursal?._id}`,
          { params }
        );
        this.operaciones = response.data.data.operaciones;
      } catch (error) {
        this.error = 'Error al obtener operaciones';
        console.error('Error al obtener operaciones', error);
        throw error;
      } finally {
        this.loading = false;
      }
    },
    async getOperacionById(operacionId: string) {
      const authStore = useAuthStore();
      try {
        this.loading = true;
        const response = await axios.get<ApiResponse<SingleOperacionResponse>>(
          `${API_BASE_URL}/api/${authStore.company?._id}/operaciones/${authStore.sucursal?._id}/${operacionId}`
        );
        this.currentOperacion = response.data.data.operacion;
      } catch (error) {
        this.error = 'Error al obtener operación';
        console.error('Error al obtener operación', error);
        throw error;
      } finally {
        this.loading = false;
      }
    },
    
    async createOperacion(operacion: NewOperacion) {
      const authStore = useAuthStore();
      try {
        this.loading = true;
        if (!authStore.company?._id || !authStore.sucursal?._id) {
          throw new Error('ID de compañía o sucursal no disponibles');
        }
        
        // Transformar los datos para cumplir con el formato esperado por la API
        const operacionRequest = {
          ...operacion,
          procesos: operacion.procesos.map(proceso => ({
            ...proceso,
            // Verificar si responsable existe y tiene _id antes de acceder
            responsable: proceso.responsable && proceso.responsable._id ? proceso.responsable._id : '',
            detalles: proceso.detalles.map(detalle => ({
              ...detalle,
              // Verificar si maquina existe y tiene _id antes de acceder
              maquina: detalle.maquina && detalle.maquina._id ? detalle.maquina._id : ''
            }))
          }))
        };
        
        console.log('Enviando operación a la API:', operacionRequest);

        const response = await axios.post<{ message: string; operacion: { _id: string; currentStage: string; nextStage: string } }>(
          `${API_BASE_URL}/api/${authStore.company._id}/operaciones/${authStore.sucursal._id}`,
          operacionRequest
        );
        
        console.log('Respuesta API:', response.data);
        
        // Verificar que response.data y response.data.operacion existen
        if (response.data && response.data.operacion) {
          // Extraer datos de la operación original excluyendo lo que viene de la API
          const { currentStage, nextStage, ...restOperacion } = operacion;
          
          // Crear una operación con los datos correctos
          const newOperacion: Operacion = {
            ...restOperacion as any,  // Datos base de la operación (sin currentStage/nextStage)
            _id: response.data.operacion._id, // ID de la respuesta
            currentStage: response.data.operacion.currentStage , 
            nextStage: response.data.operacion.nextStage, 
            procesos: operacion.procesos || []
          };
          
          // Añadir a la lista local
          this.operaciones.push(newOperacion);
          console.log('Nueva operación añadida:', newOperacion);
          
          // Devolver la respuesta completa en formato compatible
          return {
            success: true,
            data: {
              operacion: newOperacion
            }
          };
        } else {
          console.error('La respuesta de la API no tiene el formato esperado:', response.data);
          
          // Si no tenemos operacion en la respuesta, crear un objeto compatible con datos mínimos
          return {
            success: true,
            data: {
              operacion: {
                _id: response.data?.operacion?._id || 'unknown-id',
                currentStage: response.data?.operacion?.currentStage || operacion.currentStage,
                nextStage: response.data?.operacion?.nextStage || operacion.nextStage,
                procesos: [],
                estadoOperacion: false,
                fecInicio: operacion.fecInicio,
                fecFinal: operacion.fecFinal
              } as Operacion
            }
          };
        }
      } catch (error) {
        this.error = 'Error al crear operación';
        console.error('Error al crear operación', error);
        throw error;
      } finally {
        this.loading = false;
      }
    },

    async updateOperacion(operacionId: string, updates: Partial<Operacion>) {
      const authStore = useAuthStore();
      try {
        this.loading = true;
        await axios.put<ApiResponse<SingleOperacionResponse>>(
          `${API_BASE_URL}/api/${authStore.company?._id}/operaciones/${authStore.sucursal?._id}/${operacionId}`,
          updates
        );
        if (this.currentOperacion && this.currentOperacion._id === operacionId) {
          this.currentOperacion = { ...this.currentOperacion, ...updates };
        }
      } catch (error) {
        this.error = 'Error al actualizar operación';
        console.error('Error al actualizar operación', error);
        throw error;
      } finally {
        this.loading = false;
      }
    },
    async deleteOperacion(operacionId: string) {
      const authStore = useAuthStore();
      try {
        this.loading = true;
        await axios.delete<ApiResponse<never>>(
          `${API_BASE_URL}/api/${authStore.company?._id}/operaciones/${operacionId}`
        );
        this.operaciones = this.operaciones.filter(op => op._id !== operacionId);
      } catch (error) {
        this.error = 'Error al eliminar operación';
        console.error('Error al eliminar operación', error);
        throw error;
      } finally {
        this.loading = false;
      }
    },
    async addProcesoToOperacion(operacionId: string, proceso: NewProceso) {
      const authStore = useAuthStore();
      try {
        this.loading = true;

        // Verificar que company y sucursal existan
        if (!authStore.company?._id || !authStore.sucursal?._id) {
          throw new Error('ID de compañía o sucursal no disponibles');
        }

        console.log('Añadiendo proceso a operación:', operacionId, proceso);

        // Adaptar el formato del proceso según la documentación de la API
        const procesoRequest = {
          tipo: proceso.tipo,
          fecha: proceso.fecha,
          hora: proceso.hora,
          responsable: proceso.responsable._id,
          detalles: proceso.detalles.map(detalle => ({
            numOrden: detalle.numOrden,
            maquina: detalle.maquina._id,
            cantPrendas: detalle.cantPrendas,
            etiqueta: detalle.etiqueta,
            observaciones: detalle.observaciones
          }))
        };

        console.log('Enviando procesoRequest:', procesoRequest);
        console.log('URL de petición:', `${API_BASE_URL}/api/${authStore.company._id}/operaciones/${authStore.sucursal._id}/${operacionId}/procesos`);

        const response = await axios.post<ApiResponse<SingleOperacionResponse> | any>(
          `${API_BASE_URL}/api/${authStore.company._id}/operaciones/${authStore.sucursal._id}/${operacionId}/procesos`,
          procesoRequest
        );

        console.log('Respuesta API (addProceso):', response.data);

        // Manejar múltiples formatos posibles de respuesta
        let updatedOperacion: Operacion | null = null;

        if (response.data?.data?.operacion) {
          // Formato esperado: { data: { operacion: Operacion } }
          updatedOperacion = response.data.data.operacion;
        } else if (response.data?.operacion) {
          // Formato alternativo: { operacion: Operacion }
          updatedOperacion = response.data.operacion;
        } else if (response.data?._id) {
          // La respuesta directamente es la operación
          updatedOperacion = response.data;
        }

        if (updatedOperacion) {
          // Actualizar la lista local de operaciones
          this.operaciones = this.operaciones.map(op =>
            op._id === updatedOperacion?._id ? updatedOperacion : op
          );

          // Actualizar la operación actual si es la misma
          if (this.currentOperacion && this.currentOperacion._id === operacionId) {
            this.currentOperacion = updatedOperacion;
          }

          // Forzar nueva búsqueda de operaciones para asegurar sincronización
          this.fetchOperaciones();

          return {
            success: true,
            data: {
              operacion: updatedOperacion
            }
          };
        }

        // Si no podemos extraer la operación de la respuesta, retornamos los datos crudos
        return response.data;
      } catch (error) {
        this.error = 'Error al agregar proceso a operación';
        console.error('Error al agregar proceso a operación', error);
        throw error;
      } finally {
        this.loading = false;
      }
    },
    async updateProceso(operacionId: string, procesoId: string, updates: Partial<Proceso>) {
      const authStore = useAuthStore();
      try {
        this.loading = true;
        const response = await axios.patch<ApiResponse<SingleOperacionResponse>>(
          `${API_BASE_URL}/api/${authStore.company?._id}/operaciones/${authStore.sucursal?._id}/${operacionId}/procesos/${procesoId}`,
          updates
        );
        console.log("respuesta del servidor:  ", JSON.stringify(response.data));
        const updatedOperacion = response.data.data.operacion;
        console.log("Operacion actualizada:" ,JSON.stringify(updatedOperacion));
        // this.operaciones = this.operaciones.map(op =>
        //   op._id === updatedOperacion._id ? updatedOperacion : op
        // );
        // if (this.currentOperacion && this.currentOperacion._id === operacionId) {
        //   this.currentOperacion = updatedOperacion;
        // }
      } catch (error) {
        this.error = 'Error al actualizar proceso';
        console.error('Error al actualizar proceso', error);
        throw error;
      } finally {
        this.loading = false;
      }
    },
    async updateCurrentStage(operacionId: string, updates: { currentStage: string; nextStage: string }) {
      const authStore = useAuthStore();
      try {
        this.loading = true;
        const response = await axios.patch<ApiResponse<SingleOperacionResponse>>(
          `${API_BASE_URL}/api/${authStore.company?._id}/operaciones/${authStore.sucursal?._id}/${operacionId}/stage`,
          updates
        );
        const updatedOperacion = response.data.data.operacion;
        this.operaciones = this.operaciones.map(op =>
          op._id === updatedOperacion._id ? updatedOperacion : op
        );
        if (this.currentOperacion && this.currentOperacion._id === operacionId) {
          this.currentOperacion = updatedOperacion;
        }
      } catch (error) {
        this.error = 'Error al actualizar etapa';
        console.error('Error al actualizar etapa', error);
        throw error;
      } finally {
        this.loading = false;
      }
    },
    async filterProcesos(filters: ProcesoFilters) {
      const authStore = useAuthStore();
      try {
        this.loading = true;
        const params = new URLSearchParams();
        if (filters.tipo) params.append('tipo', filters.tipo);
        if (filters.fecha) params.append('fecha', filters.fecha);
        if (filters.responsable) params.append('responsable', filters.responsable);
        if (filters.estado) params.append('estado', filters.estado.toString());

        const response = await axios.get<ApiResponse<ProcesoResponse>>(
          `${API_BASE_URL}/api/${authStore.company?._id}/operaciones/${authStore.sucursal?._id}/procesos/filter`,
          { params }
        );
        return response.data.data.procesos;
      } catch (error) {
        this.error = 'Error al filtrar procesos';
        console.error('Error al filtrar procesos', error);
        throw error;
      } finally {
        this.loading = false;
      }
    },
    async getProcesosByNumOrden(numOrden: string) {
      const authStore = useAuthStore();
      try {
        this.loading = true;
        const response = await axios.get<ApiResponse<ProcesoResponse>>(
          `${API_BASE_URL}/api/${authStore.company?._id}/operaciones/procesos/by-orden`,
          { params: { numOrden } }
        );
        return response.data.data.procesos;
      } catch (error) {
        this.error = 'Error al obtener procesos por número de orden';
        console.error('Error al obtener procesos por número de orden', error);
        throw error;
      } finally {
        this.loading = false;
      }
    }
  },
  getters: {
    totalProcesosLavado: (state) => {
      return state.operaciones.reduce(
        (acc, op) => acc + op.procesos.filter(p => p.tipo === 'Lavado').length, 0
      );
    },
    getOperacionesPorProceso: (state) => {
      // Obtener la fecha actual y calcular los últimos 6 meses
      const meses = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
      const mesActual = new Date().getMonth();
      const ultimosMeses: string[] = [];

      // Obtener los últimos 6 meses
      for (let i = 5; i >= 0; i--) {
        const mesIndex = (mesActual - i + 12) % 12;
        ultimosMeses.push(meses[mesIndex]);
      }

      // Inicializar contadores
      const contadores = {
        lavado: Array(6).fill(0),
        secado: Array(6).fill(0),
        planchado: Array(6).fill(0),
        teñido: Array(6).fill(0)
      };

      // Procesar las operaciones
      state.operaciones.forEach((operacion) => {
        if (!operacion.procesos || !Array.isArray(operacion.procesos)) return;

        operacion.procesos.forEach((proceso) => {
          // Verificar campos de fecha disponibles
          const fechaCreacion = proceso.createdAt || proceso.fecha;
          if (!fechaCreacion) return;

          try {
            const fechaProceso = new Date(fechaCreacion);
            if (isNaN(fechaProceso.getTime())) return;

            const mesProceso = fechaProceso.getMonth();
            const nombreMes = meses[mesProceso];

            // Verificar si este mes está en nuestro rango de últimos 6 meses
            const indexEnUltimosMeses = ultimosMeses.indexOf(nombreMes);

            if (indexEnUltimosMeses !== -1) {
              // Normalizar el tipo de proceso a minúsculas para la comparación
              const tipoProceso = (proceso.tipo || '').toLowerCase();

              // Incrementar el contador según el tipo de proceso (insensible a mayúsculas/minúsculas)
              if (tipoProceso.includes('lavado')) {
                contadores.lavado[indexEnUltimosMeses]++;
              } else if (tipoProceso.includes('secado')) {
                contadores.secado[indexEnUltimosMeses]++;
              } else if (tipoProceso.includes('planchado')) {
                contadores.planchado[indexEnUltimosMeses]++;
              } else if (tipoProceso.includes('teñido') || tipoProceso.includes('tenido')) {
                contadores.teñido[indexEnUltimosMeses]++;
              }
            }
          } catch (error) {
            console.error(`Error procesando fecha: ${fechaCreacion}`, error);
          }
        });
      });

      return {
        meses: ultimosMeses,
        procesos: contadores
      };
    }
  },
});
