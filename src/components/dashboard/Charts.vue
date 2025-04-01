<template>
    <div class="card">
        <div v-if="loading" class="flex justify-center items-center h-[30rem]">
            <ProgressSpinner style="width:50px;height:50px" strokeWidth="3" fill="var(--surface-ground)" animationDuration=".5s" />
        </div>
        <Chart v-else type="line" :data="chartData" :options="chartOptions" class="h-[30rem]" />
    </div>
</template>

<script setup>
import { ref, onMounted, watch } from "vue";
import { useOperationStore } from "@/stores/OperationStore";
import { useRouter } from "vue-router";
import ProgressSpinner from "primevue/progressspinner";

const operationStore = useOperationStore();
const router = useRouter();
const chartData = ref();
const chartOptions = ref();
const loading = ref(true);

// Función para obtener los datos de operaciones
const fetchOperacionesData = async () => {
    try {
        // Llamar a la acción del store de Pinia que obtiene las operaciones
        await operationStore.fetchOperaciones();
        
        // Retornar los datos del store utilizando el nuevo getter
        return operationStore.getOperacionesPorProceso;

    } catch (error) {
        console.error('Error al obtener datos de operaciones:', error);
        return {
            meses: [],
            procesos: {
                lavado: [],
                secado: [],
                planchado: [],
                teñido: []
            }
        };
    }
};

// Función para preparar los datos del gráfico
const setChartData = (operacionesData) => {
    const documentStyle = getComputedStyle(document.documentElement);

    return {
        labels: operacionesData.meses,
        datasets: [
            {
                label: 'Lavado',
                fill: false,
                borderColor: documentStyle.getPropertyValue('--blue-500'),
                backgroundColor: documentStyle.getPropertyValue('--blue-500'),
                yAxisID: 'y',
                tension: 0.4,
                data: operacionesData.procesos.lavado
            },
            {
                label: 'Secado',
                fill: false,
                borderColor: documentStyle.getPropertyValue('--green-500'),
                backgroundColor: documentStyle.getPropertyValue('--green-500'),
                yAxisID: 'y',
                tension: 0.4,
                data: operacionesData.procesos.secado
            },
            {
                label: 'Planchado',
                fill: false,
                borderColor: documentStyle.getPropertyValue('--orange-500'),
                backgroundColor: documentStyle.getPropertyValue('--orange-500'),
                yAxisID: 'y',
                tension: 0.4,
                data: operacionesData.procesos.planchado
            },
            {
                label: 'Teñido',
                fill: false,
                borderColor: documentStyle.getPropertyValue('--purple-500'),
                backgroundColor: documentStyle.getPropertyValue('--purple-500'),
                yAxisID: 'y',
                tension: 0.4,
                data: operacionesData.procesos.teñido
            }
        ]
    };
};

// Función para configurar las opciones del gráfico
const setChartOptions = () => {
    const documentStyle = getComputedStyle(document.documentElement);
    const textColor = documentStyle.getPropertyValue('--text-color') || '#495057';
    const textColorSecondary = documentStyle.getPropertyValue('--text-color-secondary') || '#6c757d';
    const surfaceBorder = documentStyle.getPropertyValue('--surface-border') || '#dee2e6';

    return {
        stacked: false,
        maintainAspectRatio: false,
        aspectRatio: 0.6,
        plugins: {
            legend: {
                labels: {
                    color: textColor
                },
                position: 'top'
            },
            tooltip: {
                mode: 'index',
                intersect: false
            },
            title: {
                display: true,
                text: 'Cantidad de Operaciones por Proceso',
                color: textColor,
                font: {
                    size: 16
                }
            }
        },
        scales: {
            x: {
                title: {
                    display: true,
                    text: 'Mes',
                    color: textColor
                },
                ticks: {
                    color: textColorSecondary
                },
                grid: {
                    color: surfaceBorder
                }
            },
            y: {
                type: 'linear',
                display: true,
                position: 'left',
                title: {
                    display: true,
                    text: 'Cantidad de Operaciones',
                    color: textColor
                },
                ticks: {
                    color: textColorSecondary
                },
                grid: {
                    color: surfaceBorder
                },
                min: 0
            }
        },
        interaction: {
            mode: 'nearest',
            axis: 'x',
            intersect: false
        }
    };
};

// Función para actualizar el gráfico con los datos más recientes
const actualizarGrafico = async () => {
    loading.value = true;
    const operacionesData = await fetchOperacionesData();
    chartData.value = setChartData(operacionesData);
    chartOptions.value = setChartOptions();
    loading.value = false;
};

// Inicializar el gráfico cuando el componente se monta
onMounted(async () => {
    await actualizarGrafico();
});

// Actualizar el gráfico cuando la ruta cambia (cuando se navega a esta página)
watch(
    () => router.currentRoute.value.path,
    async (newPath, oldPath) => {
        if (newPath && newPath.includes('dashboard')) {
            await actualizarGrafico();
        }
    }
);
</script>
