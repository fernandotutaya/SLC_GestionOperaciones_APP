<template>
    <div class="min-h-screen w-full flex items-center justify-center bg-surface-ground">
        <div class="text-center">
            <div class="mb-8">
                <i class="pi pi-exclamation-circle text-primary-500 text-8xl"></i>
            </div>
            <div class="text-900 font-bold text-9xl mb-6">404</div>
            <div class="text-900 font-bold text-3xl mb-6">NO ENCONTRADO</div>
            <div class="text-600 font-medium text-2xl mb-8">La página que buscas no existe</div>
            <Button 
                label="Volver al inicio" 
                icon="pi pi-home" 
                severity="primary" 
                rounded 
                @click="navigateHome"
                class="px-6 py-3 text-lg"
            />
        </div>
    </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router';
import Button from 'primevue/button';

const router = useRouter();

const navigateHome = () => {
    router.push('/app');
};
</script>

<style scoped>
.text-primary-500 {
    color: var(--primary-color);
}

.text-900 {
    color: var(--surface-900);
}

.text-600 {
    color: var(--surface-600);
}

.bg-surface-ground {
    background-color: var(--surface-ground);
}
</style>