<template>
    <div>
        <div class="p-d-flex p-ai-center">
            <Button :label="company.username" type="button" icon="pi pi-user" severity="secondary" variant="text" iconPos="right" @click="toggle" aria-controls="overlay_menu" />
            <Menu ref="menu" id="overlay_menu" :model="items" :popup="true" />
            <Avatar class="ml-2" shape="circle" style="background-color: #ece9fc; color: #2a1261; height: 48px; width: 48px;">
                <p>ME</p>
            </Avatar>
        </div>
    </div>
</template>


<script setup lang="ts">
import { ref } from "vue";
import { useAuthStore } from "@/stores/AuthStore";

const authStore = useAuthStore();
const company = ref({
    username: 'Mi Empresa'
});
const menu = ref();
const handleLogout = () => {
    authStore.logout();
};

const items = ref([
    {
        label: 'Opciones',
        items: [
            {
                label: 'Configuración',
                icon: 'pi pi-cog'
            },
            {
                label: 'Cambiar Plan',
                icon: 'pi pi-pencil'
            },
            {
                separator: true
            },
            {
                label: 'Cerrar Sesión',
                icon: 'mdi mdi-logout',
                command: handleLogout
            },
        ]
    }
]);

const toggle = (event: any) => {
    menu.value.toggle(event);
};
</script>