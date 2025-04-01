<script setup lang="ts">
import { ref, watch, onMounted, computed } from 'vue';
import { useOperationStore } from '@/stores/OperationStore';
import { useEmployeeStore } from '@/stores/EmployeeStore';
import { useToast } from 'primevue/usetoast';
import type { Proceso, Operacion, NewOperacion, ProcesoDetail } from '@/types/OperationTypes';
import ProcessDetails from './ProcessDetails.vue';

// Stores
const operationStore = useOperationStore();
const employeeStore = useEmployeeStore();
const toast = useToast();

// Props y Emits
const props = defineProps<{
  visible?: boolean;
  process?: Proceso | null;
  operation?: Operacion | null | undefined;
  mode?: 'view' | 'edit' | 'add';
  machines: any[];
}>();

const emit = defineEmits<{
  (e: 'update:visible', value: boolean): void;
  (e: 'saved'): void;
}>();

// Estado y Referencias
const loading = ref(false);
const selectedResponsableId = ref('');

// Datos de proceso
const procesoTipos = [
  { label: 'Lavado', value: 'lavado' },
  { label: 'Secado', value: 'secado' },
  { label: 'Planchado', value: 'planchado' },
  { label: 'Doblado', value: 'doblado' },
  { label: 'Empaquetado', value: 'empaquetado' },
  {label: 'Control de Calidad', value: 'cc'},
  {label: 'Finalizado', value: 'finalizado'}

];

// Formulario inicial
const formData = ref<Proceso>({
  _id: '',
  tipo: 'lavado',
  fecha: new Date().toISOString(),
  hora: '08:00',
  responsable: {
    _id: '',
    nombreCompleto: 'Responsable no asignado'
  },
  detalles: [],
  estado: false,
  operacionId: props.operation?._id || '',
  createdAt: new Date().toISOString(),
  nextStage: ''
});

const detallesEditables = ref<Proceso['detalles']>([]);
const isViewOnly = computed(() => props.mode === 'view');

// Lifecycle Hooks
onMounted(async () => {
  await employeeStore.initialize();
});

// Observadores
watch(() => props.visible, async (visible) => {
  if (visible) {
    await employeeStore.initialize();
    
    if (props.process && (props.mode === 'edit' || props.mode === 'view')) {
      formData.value = { ...props.process };
      detallesEditables.value = [...props.process.detalles];
      
      // Inicializa el ID del responsable si existe
      if (props.process.responsable?._id) {
        selectedResponsableId.value = props.process.responsable._id;
      }
    } else if (props.mode === 'add') {
      resetForm();
    }
  }
});

// Observa cambios en el responsable seleccionado
watch(() => selectedResponsableId.value, (newId) => {
  if (newId) {
    const selectedEmployee = employeeStore.employees.find(emp => emp._id === newId);
    if (selectedEmployee) {
      // Actualiza el objeto responsable en formData cuando cambia la selección
      formData.value.responsable = {
        _id: selectedEmployee._id,
        nombreCompleto: `${selectedEmployee.apellidos} ${selectedEmployee.nombres}`,
        puesto: selectedEmployee.puesto,
        area: selectedEmployee.areaTrabajo
      };
    }
  }
});

// Métodos
const resetForm = () => {
  formData.value = {
    _id: '',
    tipo: 'lavado',
    fecha: new Date().toISOString(),
    hora: '08:00',
    responsable: {
      _id: '',
      nombreCompleto: 'Responsable no asignado'
    },
    detalles: [],
    estado: false,
    operacionId: '',
    createdAt: new Date().toISOString(),
    nextStage: 'secado'
  };
  detallesEditables.value = [];
  selectedResponsableId.value = '';
};

const updateDetalles = (detalles: ProcesoDetail[]) => {
  formData.value.detalles = [...detalles];
};

const validateForm = (): boolean => {
  // En modo view no validamos
  if (props.mode === 'view') {
    return true;
  }

  // Verificar que se ha seleccionado un responsable
  if (!formData.value.responsable._id) {
    toast.add({ severity: 'error', summary: 'Error', detail: 'Debe seleccionar un responsable', life: 3000 });
    return false;
  }
  
  // Verificar que hay al menos un detalle
  if (formData.value.detalles.length === 0) {
    toast.add({ severity: 'error', summary: 'Error', detail: 'Debe agregar al menos un detalle al proceso', life: 3000 });
    return false;
  }

  // Verificar que todos los detalles tienen datos completos
  const incompletosDetalles = formData.value.detalles.some(
    detalle => !detalle.numOrden || !detalle.maquina._id || !detalle.cantPrendas
  );
  
  if (incompletosDetalles) {
    toast.add({ severity: 'error', summary: 'Error', detail: 'Todos los detalles deben estar completos', life: 3000 });
    return false;
  }

  return true;
};

const saveProcess = async () => {
  try {
    // Validar el formulario antes de proceder
    if (!validateForm()) {
      return;
    }
    
    loading.value = true;
    
    if (props.mode === 'add') {
      // Creación del proceso a partir del formulario para nueva operación
      const newProceso: Proceso = {
        tipo: formData.value.tipo,
        fecha: formData.value.fecha,
        hora: formData.value.hora,
        responsable: {
          _id: formData.value.responsable._id,
        },
        detalles: [
          ...formData.value.detalles.map(d => ({
            numOrden: d.numOrden,
            maquina: {
              _id: d.maquina._id
            },
            cantPrendas: d.cantPrendas,
            etiqueta: d.etiqueta,
            observaciones: d.observaciones
          }))
        ],
        estado: false,
        createdAt: formData.value.createdAt,
      };
      
      // Creación del siguiente proceso a partir del formulario
      const nextProceso: Proceso = {
        tipo: formData.value.nextStage || 'No definido',
        fecha: formData.value.fecha,
        hora: formData.value.hora,
        responsable: formData.value.responsable,
        detalles: [...formData.value.detalles.map(d => ({
          numOrden: d.numOrden,
          maquina: {
            _id: d.maquina._id
          },
          cantPrendas: d.cantPrendas,
          etiqueta: d.etiqueta,
          observaciones: d.observaciones
        }))],
        estado: false,
        createdAt: formData.value.createdAt,
      };
      
      // Create a new operation with the current process
      const newOperation: NewOperacion = {
        fecInicio: new Date().toISOString(),
        fecFinal: new Date(Date.now() + 8 * 60 * 60 * 1000).toISOString(), // Default 8 hours later
        estadoOperacion: false,
        currentStage: formData.value.tipo.toLowerCase(),
        nextStage: formData.value.nextStage?.toLowerCase() || 'secado',
        procesos: [newProceso, nextProceso]
      };
      
      await operationStore.createOperacion(newOperation);
      
      toast.add({ severity: 'success', summary: 'Éxito', detail: 'Proceso creado correctamente', life: 3000 });
    } else if (props.mode === 'edit') {
      // Para la actualización, necesitamos adaptar el objeto al formato esperado por la API
      // Siguiendo la estructura requerida por updateProceso en el store
      
      const updatedProceso: Partial<Proceso> = {
        tipo: formData.value.tipo.toLowerCase(),
        fecha: formData.value.fecha,
        hora: formData.value.hora,
        responsable: {
          _id: formData.value.responsable._id,
        },
        detalles: formData.value.detalles.map(d => ({
          numOrden: d.numOrden,
          maquina: {
            _id: d.maquina._id
          },
          cantPrendas: d.cantPrendas,
          etiqueta: d.etiqueta,
          observaciones: d.observaciones
        })),
        estado: formData.value.estado
      };
      
      // También actualizar la etapa actual si es necesario
      if (formData.value.nextStage) {
        await operationStore.updateCurrentStage(
          props.operation._id,
          { 
            currentStage: formData.value.tipo.toLowerCase(),
            nextStage: formData.value.nextStage.toLowerCase() 
          }
        );
      }
      
      // Actualizar el proceso en sí
      await operationStore.updateProceso(
        props.operation._id,
        formData.value._id,
        updatedProceso
      );
      toast.add({ severity: 'success', summary: 'Éxito', detail: 'Proceso actualizado correctamente', life: 3000 });
    }else{
      console.log("No se ha podido actualizar el proceso");
    }
    
    emit('saved');
    closeDrawer();
  } catch (error) {
    console.error('Error saving process:', error);
    toast.add({ severity: 'error', summary: 'Error', detail: 'Ha ocurrido un error al guardar el proceso', life: 3000 });
  } finally {
    loading.value = false;
  }
};

const closeDrawer = () => emit('update:visible', false);
</script>

<template>
  <Drawer
    v-model:visible="props.visible"
    :header="props.mode === 'add' ? 'Crear nuevo proceso' : props.mode === 'edit' ? 'Editar proceso' : 'Ver proceso'"
    position="full"
    :showCloseIcon="true"
    :modal="true"
    :dismissable="true"
    :blockScroll="true"
    class="w-80"
    @update:visible="closeDrawer" 
  >
    <Toast />
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div class="space-y-4">
        <!-- Selector de Responsable -->
        <div v-if="props.mode === 'add' || props.mode === 'edit'" class="field">
          <label>Seleccionar Responsable</label>
          <Dropdown
            v-model="selectedResponsableId"
            :options="employeeStore.employees"
            :optionLabel="item => item.apellidos + ' ' + item.nombres"
            optionValue="_id"
            placeholder="Seleccione responsable"
            class="w-full"
          />
          <small v-if="formData.responsable._id" class="text-green-500">
            Responsable seleccionado: {{ formData.responsable.nombreCompleto }}
          </small>
        </div>

        <!-- Campos visibles en modo add -->
        <div v-if="props.mode === 'add'" class="field">
          <label>Tipo de Proceso</label>
          <Dropdown
            v-model="formData.tipo"
            :options="procesoTipos"
            optionLabel="label"
            optionValue="value"
            placeholder="Seleccione tipo de proceso"
            class="w-full"
          />
        </div>

        <div v-if="props.mode === 'add'" class="field">
          <label>Siguiente Etapa</label>
          <Dropdown
            v-model="formData.nextStage"
            :options="procesoTipos"
            optionLabel="label"
            optionValue="value"
            placeholder="Seleccione la siguiente etapa"
            class="w-full"
          />
        </div>

        <!-- Campos visibles en modo edit y view -->
        <div v-if="props.mode === 'edit' || props.mode === 'view'" class="field">
          <label>Operación asociada</label>
          <InputText 
            :modelValue="props.operation?._id" 
            class="w-full" 
            disabled
          />
        </div>

        <div v-if="props.mode === 'view'" class="field">
          <label>Responsable</label>
          <InputText 
            :modelValue="formData.responsable.nombreCompleto" 
            class="w-full" 
            disabled
          />
        </div>

        <div v-if="props.mode === 'edit' || props.mode === 'view'" class="field">
          <label>Fecha y Hora</label>
          <Calendar 
            v-model="formData.fecha" 
            showTime 
            hourFormat="24" 
            class="w-full"
            :disabled="isViewOnly"
          />
        </div>

        <div class="field">
          <label>Estado del Proceso</label>
          <SelectButton
            v-model="formData.estado"
            :options="[ 
              { label: 'Pendiente', value: false },
              { label: 'Finalizado', value: true }
            ]"
            optionLabel="label"
            optionValue="value"
            :disabled="isViewOnly"
          />
        </div>
      </div>

      <div class="lg:col-span-2">
        <ProcessDetails 
          v-model="formData.detalles"
          @update:modelValue="updateDetalles"
          :machines="props.machines"
          :isViewOnly="isViewOnly"
        />
      </div>
    </div>

    <template #footer>
      <Button 
        label="Cancelar" 
        severity="secondary" 
        @click="closeDrawer"
        :disabled="loading"
      />
      <Button 
        :label="props.mode === 'edit' ? 'Actualizar' : 'Guardar'" 
        icon="pi pi-check" 
        :loading="loading"
        @click="saveProcess"
        :disabled="isViewOnly"
      />
    </template>
  </Drawer>
</template>