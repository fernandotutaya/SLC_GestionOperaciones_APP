import { reactive, type App } from 'vue';

// Define el tipo para el estado de la aplicación
interface AppState {
    theme: string;
    darkTheme: boolean;
}

// Exporta el plugin
export default {
    install: (app: App): void => {
        // Define el estado reactivo con los tipos correspondientes
        const _appState: AppState = reactive({ 
            theme: 'Aura', 
            darkTheme: true 
        });

        // Agrega el estado global a las propiedades de la aplicación
        app.config.globalProperties.$appState = _appState;
    }
};

// Extiende las propiedades globales de la aplicación para incluir $appState
declare module 'vue' {
    interface ComponentCustomProperties {
        $appState: AppState;
    }
}
