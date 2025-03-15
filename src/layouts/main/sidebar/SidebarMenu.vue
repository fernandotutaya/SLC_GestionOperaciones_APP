<template>
    <Menu :model="items" :style="{ border: 'none' }">
        <template #submenuitem="{ item }">
            <span class="text-primary font-bold">{{ item.label }}</span>
        </template>
        <template #item="{ item, props }">
            <router-link v-ripple class="flex items-center" v-bind="props.action" :to="item.to">
                <span :class="item.icon" />
                <span>{{ item.label }}</span>
                <Badge v-if="item.badge" class="ml-auto" :value="item.badge" />
            </router-link>
        </template>
    </Menu>
    
</template>

<script lang="ts" setup>
import { ref } from "vue";
import { useAuthStore } from "@/stores/AuthStore";

const authStore = useAuthStore();

const handleLogout = () => {
    authStore.logout();
};

const items = ref([

    {
        label: 'Operaciones Lavanderia',
        items: [
            {
                label: 'Nueva Operación',
                icon: 'pi pi-plus',
                to: '/app/new'
            },
            {
                label: 'Buscar Orden',
                icon: 'pi pi-search',
                to: '/app/search'
            }
        ]
    },
    {
        separator: true
    },
    {
        label: 'Perfil',
        items: [
            {
                label: 'Configuración',
                icon: 'pi pi-cog',
                to: '/app/config'
            },
            {
                label: 'Mensajes',
                icon: 'pi pi-inbox',
                badge: 2,
                children: [
                    {
                        label: 'Nuevo',
                        icon: 'pi pi-plus',
                        to: '/mensajes/nuevo'
                    },
                    {
                        label: 'Leído',
                        icon: 'pi pi-eye',
                        to: '/mensajes/leido'
                    }
                ]
            },
            {
                label: 'Cerrar Sesión',
                icon: 'pi pi-sign-out',
                shortcut: '⌘+Q',
                command: handleLogout
            }
        ]
    }
]);
</script>
