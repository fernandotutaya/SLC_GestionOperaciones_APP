import 'primeicons/primeicons.css' 
import '@mdi/font/css/materialdesignicons.css'
import '@/assets/styles.css'
import PrimeVue from 'primevue/config'
import { ConfirmationService } from 'primevue'
import { ToastService } from 'primevue'
import { DialogService } from 'primevue'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import { useAuthStore } from '@/stores/AuthStore';
import { useEmployeeStore } from './stores/EmployeeStore'

import Noir from '@/themes/Noir'


async function initializeApp() {
    const app = createApp(App);

    app.use(PrimeVue, {
        theme: {
            preset: Noir,
        }, 
        options:{
            prefix: 'p',
            darkModeSelector: '.p-dark',
            cssLayer: false,
        }
    });
    app.use(ConfirmationService)
    app.use(ToastService)
    app.use(DialogService)
    
    app.use(createPinia());
    app.use(router);

    // Obtener el store después de crear Pinia
    const authStore = useAuthStore();
    await authStore.init(); // Esperar a que se complete la inicialización

    // Solo inicializar el store de empleados si el usuario está autenticado
    // if (authStore.isAuthenticated) {
    //     try {
    //         // Inicializar el store de empleados para cargar la lista al inicio
    //         const employeeStore = useEmployeeStore();
    //         await employeeStore.initialize();
    //     } catch (error) {
    //         console.error('Error al obtener empleados:', error);
    //         // Continuar con la aplicación aunque haya un error con los empleados
    //     }
    // }
    
    app.mount('#root');
    console.log('Aplicación inicializada');
}

initializeApp().catch((error) => {
console.error('Error inicializando la app:', error);
});