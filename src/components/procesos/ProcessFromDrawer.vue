<script setup lang="ts">
import { ref, watch, onMounted, computed } from 'vue';
import { useOperationStore } from '@/stores/OperationStore';
import { useEmployeeStore } from '@/stores/EmployeeStore';
import type { Proceso, Operacion, NewOperacion, NewProceso, ProcesoDetail } from '@/types/OperationTypes';
import ProcessDetails from './ProcessDetails.vue';
import { useAuthStore } from '@/stores/AuthStore';
import { useToast } from 'primevue/usetoast';

const operationStore = useOperationStore();
const employeeStore = useEmployeeStore();
const authStore = useAuthStore();
const toast = useToast();

const props = defineProps<{
  visible?: boolean;
  process?: Proceso | null;
  operation?: Operacion | null;
  mode?: 'view' | 'edit' | 'add';
  machines: any[]; // Add machines prop
}>();

const emit = defineEmits<{
  (e: 'update:visible', value: boolean): void;
  (e: 'saved'): void;
}>();

// Opciones de tipos de proceso (en minúsculas para la API)
const procesoTipos = [
  { label: 'Lavado', value: 'lavado' },
  { label: 'Secado', value: 'secado' },
  { label: 'Planchado', value: 'planchado' },
  { label: 'Doblado', value: 'doblado' },
  { label: 'Empaquetado', value: 'empaquetado' }
];

const formData = ref<Proceso>({
  _id: '',
  tipo: 'lavado', // En minúsculas para la API
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
  nextStage: 'secado' // En minúsculas para la API
});

const detallesEditables = ref<Proceso['detalles']>([]);
const isViewOnly = computed(() => props.mode === 'view');
const selectedResponsableId = ref('');
const loading = ref(false);

// Initialize employee data when component is mounted
onMounted(async () => {
  await employeeStore.initialize();
});

watch(() => props.visible, async (visible) => {
  if (visible) {
    // Ensure employees are loaded when drawer becomes visible
    await employeeStore.initialize();
    
    if (props.process && (props.mode === 'edit' || props.mode === 'view')) {
      formData.value = { ...props.process };
      detallesEditables.value = [...props.process.detalles];
      
      // Si estamos en modo edición y hay responsable, cargamos el ID para posible edición
      if (props.mode === 'edit' && props.process.responsable?._id) {
        selectedResponsableId.value = props.process.responsable._id;
      }
    } else if (props.mode === 'add') {
      // Reiniciar el formulario para modo add
      formData.value = {
        _id: '',
        tipo: 'lavado', // En minúsculas para la API
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
        nextStage: 'secado' // En minúsculas para la API
      };
      detallesEditables.value = [];
      selectedResponsableId.value = '';
    }
  }
});

// Manejar la actualización de detalles desde el componente ProcessDetails
const updateDetalles = (detalles: ProcesoDetail[]) => {
  formData.value.detalles = [...detalles];
};

const validateForm = (): boolean => {
  // En modo view no validamos
  if (props.mode === 'view') {
    return true;
  }

  // Verificar que se ha seleccionado un responsable
  if (!selectedResponsableId.value && !formData.value.responsable._id) {
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
    
    const newProceso: Proceso = {

      // Nos aseguramos que tipo también esté en minúsculas
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

    const nextProceso: Proceso = {
      tipo: formData.value.nextStage || 'secado',
      fecha: formData.value.fecha,
      hora: formData.value.hora,
      responsable:{},
      detalles: [],
      estado: false,
      createdAt: formData.value.createdAt,
      
    };

    console.log('ESTE ES EL PROCESOS', JSON.stringify(newProceso))
    loading.value = true;
    if (props.mode === 'add') {
      // Create a new operation with the current process
      const newOperation: NewOperacion = {
        fecInicio: new Date().toISOString(),
        fecFinal: new Date(Date.now() + 8 * 60 * 60 * 1000).toISOString(), // Default 8 hours later
        estadoOperacion: false,
        currentStage: formData.value.tipo.toLowerCase(), // Aseguramos que esté en minúsculas
        nextStage: formData.value.nextStage?.toLowerCase() || 'secado', // Aseguramos que esté en minúsculas y manejamos caso undefined
        procesos: [newProceso, nextProceso]
      };
      
      console.log('Esta es la nueva operacion: ', JSON.stringify(newOperation));

      // Create operation and get the created operation ID
      const response = await operationStore.createOperacion(newOperation);
      
      // Verificamos el formato de la respuesta para compatibilidad
      // let operationId: string | undefined;
      
      // if (response?.data?.operacion?._id) {
      //   // Nuevo formato con data.operacion._id
      //   operationId = response.data.operacion._id;
      // } else if ((response as any)?.operacion?._id) {
      //   // Formato antiguo con operacion._id directamente
      //   operationId = (response as any).operacion._id;
      // }
      
      // if (operationId) {
      //   // Update process with responsable from selection if available
      //   if (selectedResponsableId.value) {
      //     const selectedEmployee = employeeStore.employees.find(emp => emp._id === selectedResponsableId.value);
      //     if (selectedEmployee) {
      //       formData.value.responsable = {
      //         _id: selectedEmployee._id,
      //         nombreCompleto: `${selectedEmployee.apellidos} ${selectedEmployee.nombres}`,
      //         puesto: selectedEmployee.puesto,
      //         area: selectedEmployee.areaTrabajo
      //       };
      //     }
      //   }
        
      //   
        
      //   // Add process to the newly created operation
      //   await operationStore.addProcesoToOperacion(
      //     operationId,
      //     newProceso
      //   );
        
      //   toast.add({ severity: 'success', summary: 'Éxito', detail: 'Proceso de lavado creado correctamente', life: 3000 });
      // }

      console.log('ESTA ES LA OPERACION', JSON.stringify(response))
    } else if (props.mode === 'edit' && props.operation?._id && formData.value._id) {
      // Si hay cambios en el responsable, actualizamos
      if (selectedResponsableId.value && selectedResponsableId.value !== formData.value.responsable._id) {
        const selectedEmployee = employeeStore.employees.find(emp => emp._id === selectedResponsableId.value);
        if (selectedEmployee) {
          formData.value.responsable = {
            _id: selectedEmployee._id,
            nombreCompleto: `${selectedEmployee.apellidos} ${selectedEmployee.nombres}`,
            puesto: selectedEmployee.puesto,
            area: selectedEmployee.areaTrabajo
          };
        }
      }
      
      // Asegurarnos que tipo y nextStage estén en minúsculas también al editar
      const updatedProceso = {
        ...formData.value,
        tipo: formData.value.tipo.toLowerCase(),
        nextStage: formData.value.nextStage?.toLowerCase() || 'secado'
      };
      
      await operationStore.updateProceso(
        props.operation._id,
        formData.value._id,
        updatedProceso
      );
      toast.add({ severity: 'success', summary: 'Éxito', detail: 'Proceso actualizado correctamente', life: 3000 });
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

const updateDetalle = (index: number, field: string, value: any) => {
  detallesEditables.value = detallesEditables.value.map((d, i) => 
    i === index ? { ...d, [field]: value } : d
  );
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
        <!-- Selector de Responsable (disponible en modo add y edit) -->
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