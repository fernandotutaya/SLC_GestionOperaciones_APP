<script setup lang="ts">
import { ref, watch } from 'vue';
import { useConfirm } from 'primevue/useconfirm';
import { useToast } from 'primevue/usetoast';
import type { ProcesoDetail } from '@/types/OperationTypes';

// Definición de la interfaz para máquinas
interface Machine {
  _id: string;
  nombreMaquina: string;
  tipo: string;
  modelo: string;
  marca: string;
}

// Definición de props con tipos específicos
const props = defineProps<{
  modelValue: ProcesoDetail[];
  machines: Machine[];
  isViewOnly?: boolean;
}>();

// Definición de emisiones
const emit = defineEmits<{
  (e: 'update:modelValue', value: ProcesoDetail[]): void;
}>();

const confirm = useConfirm();
const toast = useToast();
const editingRows = ref<ProcesoDetail[]>([]);
const details = ref<ProcesoDetail[]>([...props.modelValue]);
const clonedDetails = ref<{ [key: string]: ProcesoDetail }>({});
let tempIdCounter = 0;

// Generar ID único temporal
const generateTempId = () => `temp-${Date.now()}-${tempIdCounter++}`;

// Agregar un nuevo detalle
const addDetail = () => {
  if (props.isViewOnly) {
    toast.add({ severity: 'warn', summary: 'Advertencia', detail: 'No se puede agregar detalles en modo vista', life: 3000 });
    return;
  }

  const newDetail: ProcesoDetail = {
    numOrden: generateTempId(),
    maquina: { _id: '', nombreMaquina: '', tipo: '', modelo: '', marca: '' },
    cantPrendas: 1,
    etiqueta: '',
    observaciones: ''
  };

  details.value.unshift(newDetail);
  editingRows.value = [newDetail];
  emit('update:modelValue', details.value);
};

// Eliminar todos los detalles
const removeDetails = () => {
  if (props.isViewOnly) {
    toast.add({ severity: 'warn', summary: 'Advertencia', detail: 'No se puede eliminar detalles en modo vista', life: 3000 });
    return;
  }

  confirm.require({
    message: '¿Está seguro de eliminar todos los datos de la tabla detalles?',
    header: 'Confirmar Eliminación',
    icon: 'pi pi-exclamation-triangle',
    accept: () => {
      details.value = [];
      editingRows.value = [];
      emit('update:modelValue', details.value);
      toast.add({ severity: 'success', summary: 'Éxito', detail: 'Datos eliminados', life: 3000 });
    }
  });
}

// Iniciar edición de una fila
const onRowEditInit = (event: { data: ProcesoDetail }) => {
  clonedDetails.value[event.data.numOrden] = { ...event.data };
};

// Cancelar edición
const onRowEditCancel = (event: { data: ProcesoDetail; index: number }) => {
  details.value[event.index] = clonedDetails.value[event.data.numOrden];
  delete clonedDetails.value[event.data.numOrden];
  editingRows.value = [];
};

// Guardar edición con validaciones
const onRowEditSave = (event: { newData: ProcesoDetail; index: number }) => {
  const { newData, index } = event;

  // Validar campos requeridos
  if (!newData.numOrden.trim() || !newData.maquina._id || newData.cantPrendas < 1) {
    toast.add({ severity: 'error', summary: 'Error', detail: 'Todos los campos son requeridos', life: 3000 });
    return;
  }

  // Asignar número de orden real si es temporal
  if (newData.numOrden.startsWith('temp-')) {
    newData.numOrden = `${Date.now().toString().slice(-6)}`;
  }

  // Verificar unicidad de numOrden
  const isDuplicate = details.value.some((detail, idx) => idx !== index && detail.numOrden === newData.numOrden);
  if (isDuplicate) {
    toast.add({ severity: 'error', summary: 'Error', detail: 'El número de orden debe ser único', life: 3000 });
    return;
  }

  delete clonedDetails.value[newData.numOrden];
  details.value[index] = newData;
  editingRows.value = [];
  emit('update:modelValue', details.value);
  toast.add({ severity: 'success', summary: 'Éxito', detail: 'Detalle actualizado', life: 3000 });
};

// Eliminar un detalle específico
const removeDetail = (index: number) => {
  if (props.isViewOnly) {
    toast.add({ severity: 'warn', summary: 'Advertencia', detail: 'No se puede eliminar en modo vista', life: 3000 });
    return;
  }
  
  confirm.require({
    message: '¿Está seguro de eliminar este detalle?',
    header: 'Confirmar Eliminación',
    icon: 'pi pi-exclamation-triangle',
    accept: () => {
      details.value.splice(index, 1);
      emit('update:modelValue', details.value);
      toast.add({ severity: 'success', summary: 'Éxito', detail: 'Detalle eliminado', life: 3000 });
    }
  });
};

// Sincronizar con modelValue
watch(() => props.modelValue, (newVal) => {
  details.value = [...newVal];
}, { deep: true });

// Opciones para el dropdown de etiquetas
const colorOptions = [
  { label: 'Rojo', value: 'rojo' },
  { label: 'Azul', value: 'azul' },
  { label: 'Negro', value: 'negro' },
  { label: 'Verde', value: 'verde' },
  { label: 'Naranja', value: 'naranja' }
];

// Modificar el template del dropdown de máquina
const onMachineChange = (machineId: string, data: ProcesoDetail) => {
  const selectedMachine = props.machines.find(m => m._id === machineId);
  if (selectedMachine) {
    data.maquina = { ...selectedMachine };
  }
};
</script>

<template>
  <div class="details-editor">
    <Toast />
    <ConfirmDialog />

    <!-- Toolbar -->
    <div class="toolbar mb-4 flex space-x-4">
      <Button label="Agregar Detalle" icon="pi pi-plus" @click="addDetail" :disabled="isViewOnly" />
      <Button label="Limpiar Tabla" icon="pi pi-trash" @click="removeDetails" :disabled="isViewOnly" />
    </div>
    <!-- Tabla de detalles -->
    <DataTable
      v-model:editingRows="editingRows"
      :value="details"
      editMode="row"
      dataKey="numOrden"
      @row-edit-init="onRowEditInit"
      @row-edit-cancel="onRowEditCancel"
      @row-edit-save="onRowEditSave"
      responsiveLayout="scroll"
      class="editable-cells-table"
      :rowHover="true"
    >
      <!-- Columna: Número de Orden -->
      <Column field="numOrden" header="N° Orden">
        <template #body="{ data }">
          {{ data.numOrden && !data.numOrden.startsWith('temp-') ? data.numOrden : 'Pendiente' }}
        </template>
        <template #editor="{ data, field }">
          <InputText v-model="data[field]" class="w-full" placeholder="N° Orden" />
        </template>
      </Column>

      <!-- Columna: Máquina -->
      <Column field="maquina" header="Máquina">
        <template #body="{ data }">
          {{ data.maquina.nombreMaquina || 'No seleccionada' }}
        </template>
        <template #editor="{ data }">
          <Dropdown
            v-model="data.maquina._id"
            :options="machines"
            optionLabel="nombreMaquina"
            optionValue="_id"
            class="w-full"
            placeholder="Seleccione"
            @change="(e) => onMachineChange(e.value, data)"
          />
        </template>
      </Column>

      <!-- Columna: Cantidad -->
      <Column field="cantPrendas" header="Cantidad">
        <template #body="{ data }">
          {{ data.cantPrendas }}
        </template>
        <template #editor="{ data, field }">
          <InputNumber v-model="data[field]" :min="1" class="w-full" placeholder="Cant" />
        </template>
      </Column>

      <!-- Columna: Etiqueta -->
      <Column field="etiqueta" header="Etiqueta">
        <template #body="{ data }">
          {{ data.etiqueta || 'Sin etiqueta' }}
        </template>
        <template #editor="{ data, field }">
          <Dropdown
            v-model="data[field]"
            :options="colorOptions"
            optionLabel="label"
            optionValue="value"
            class="w-full"
            placeholder="Seleccione"
          />
        </template>
      </Column>

      <!-- Columna: Observaciones -->
      <Column field="observaciones" header="Observaciones">
        <template #body="{ data }">
          {{ data.observaciones || '-' }}
        </template>
        <template #editor="{ data, field }">
          <Textarea v-model="data[field]" class="w-full" placeholder="Observaciones" />
        </template>
      </Column>

      <!-- Columna: Editar -->
      <Column header="Editar" :rowEditor="true" bodyStyle="text-align:center" style="width: 7rem" :hidden="isViewOnly"></Column>
      
      <!-- Columna: Eliminar -->
      <Column header="Eliminar" bodyStyle="text-align:center" style="width: 6rem" :hidden="isViewOnly">
        <template #body="slotProps">
          <Button 
            icon="pi pi-trash" 
            severity="danger" 
            outlined
            @click="removeDetail(details.indexOf(slotProps.data))" 
          />
        </template>
      </Column>
    </DataTable>
  </div>
</template>

<style>
.editable-cells-table .p-datatable-tbody > tr.p-row-editing > td {
  padding-top: 0.75rem;
  padding-bottom: 0.75rem;
}
</style>