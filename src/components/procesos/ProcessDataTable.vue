<script setup lang="ts">
import { ref } from 'vue';
import { useConfirm } from 'primevue/useconfirm';
import { useToast } from 'primevue/usetoast';
import type { Proceso } from '@/types/OperationTypes';

// Definición de props con tipos específicos
const props = defineProps<{
  processes: Proceso[];
  totalRecords: number;
  loading: boolean;
}>();

// Definición de emisiones
const emit = defineEmits<{
  (e: 'page-change', page: number): void;
  (e: 'view', process: Proceso): void;
  (e: 'edit', process: Proceso): void;
  (e: 'delete', process: Proceso): void;
}>();

// Estado local
const pagination = ref({ page: 1, rows: 10 });
const confirm = useConfirm();
const toast = useToast();

/**
 * Maneja el cambio de página en la tabla
 */
const onPageChange = (event: any) => {
  const newPage = event.page + 1;
  pagination.value.page = newPage;
  emit('page-change', newPage);
};

/**
 * Obtiene los números de orden concatenados
 */
const getOrdenes = (detalles: Proceso['detalles']) => {
  return detalles?.map(d => d.numOrden).join(', ') || '-';
};

/**
 * Convierte el estado booleano a texto
 */
const getEstado = (estado: boolean) => {
  return estado ? 'Finalizado' : 'Pendiente';
};

/**
 * Formatea una fecha ISO a formato local
 * @param isoDateString - Fecha en formato ISO
 * @param locale - Código de localización (por defecto 'es-PE' para Perú)
 */
const formatDateTime = (isoDateString: string, locale: string = 'es-PE') => {
  if (!isoDateString) return { date: '-', time: '-' };
  
  try {
    const date = new Date(isoDateString);
    
    // Verificar si la fecha es válida
    if (isNaN(date.getTime())) {
      return { date: '-', time: '-' };
    }
    
    // Opciones para formatear la fecha
    const dateOptions: Intl.DateTimeFormatOptions = {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    };
    
    // Opciones para formatear la hora
    const timeOptions: Intl.DateTimeFormatOptions = {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    };
    
    return {
      date: date.toLocaleDateString(locale, dateOptions),
      time: date.toLocaleTimeString(locale, timeOptions)
    };
  } catch (error) {
    console.error('Error al formatear fecha:', error);
    return { date: '-', time: '-' };
  }
};

/**
 * Maneja la acción de ver un proceso
 */
const handleView = (process: Proceso) => {
  emit('view', process);
};

/**
 * Maneja la acción de editar un proceso
 */
const handleEdit = (process: Proceso) => {
  emit('edit', process);
};

/**
 * Maneja la acción de eliminar un proceso con confirmación
 */
const handleDelete = (process: Proceso) => {
  confirm.require({
    message: '¿Está seguro de eliminar este proceso?',
    header: 'Confirmar Eliminación',
    icon: 'pi pi-exclamation-triangle',
    accept: () => {
      emit('delete', process);
      toast.add({ severity: 'success', summary: 'Éxito', detail: 'Proceso eliminado', life: 3000 });
    }
  });
};
</script>

<template>
  <DataTable
    :value="props.processes"
    :paginator="true"
    :rows="pagination.rows"
    :totalRecords="props.totalRecords"
    :loading="props.loading"
    responsiveLayout="scroll"
    class="p-datatable-sm"
    paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink RowsPerPageDropdown"
    currentPageReportTemplate="Mostrando {first} a {last} de {totalRecords}"
    @page="onPageChange"
    stripedRows
  >
    <Column header="Ticket" style="min-width: 200px">
      <template #body="{ data }">
        <div class="font-mono text-sm">
          {{ getOrdenes(data.detalles) }}
        </div>
      </template>
    </Column>

    <!-- Columna de fecha usando createdAt -->
    <Column field="createdAt" header="Fecha" sortable style="min-width: 120px">
      <template #body="{ data }">
        {{ formatDateTime(data.createdAt).date }}
      </template>
    </Column>

    <!-- Columna de hora usando createdAt -->
    <Column field="createdAt" header="Hora" sortable style="min-width: 100px">
      <template #body="{ data }">
        {{ formatDateTime(data.createdAt).time }}
      </template>
    </Column>

    <Column header="Responsable" style="min-width: 200px">
      <template #body="{ data }">
        <div class="flex items-center gap-2">
          <Avatar 
            :label="data.responsable?.nombreCompleto?.[0] || 'U'" 
            shape="circle" 
          />
          <div>
            <div class="font-medium">{{ data.responsable?.nombreCompleto || 'N/A' }}</div>
            <div class="text-xs text-gray-500">{{ data.responsable?.puesto || 'N/A' }}</div>
          </div>
        </div>
      </template>
    </Column>

    <Column header="Estado" style="min-width: 120px">
      <template #body="{ data }">
        <Tag 
          :value="getEstado(data.estado)" 
          :severity="data.estado ? 'success' : 'warning'" 
        />
      </template>
    </Column>

    <Column header="Acciones" style="width: 150px">
      <template #body="{ data }">
        <div class="flex gap-2">
          <Button 
            icon="pi pi-eye" 
            severity="info" 
            text 
            @click="handleView(data)"
          />
          <Button 
            icon="pi pi-pencil" 
            severity="warning" 
            text 
            @click="handleEdit(data)"
          />
        </div>
      </template>
    </Column>

    <template #empty>
      <div class="text-center py-6 text-gray-500">
        No se encontraron procesos de lavado
      </div>
    </template>
  </DataTable>
</template>
