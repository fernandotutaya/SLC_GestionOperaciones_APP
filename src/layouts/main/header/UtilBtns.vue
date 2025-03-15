<template>

        <Button
        :icon="`pi ${themeTogglerIcon}`"
        @click="onThemeToggler"
        :aria-label="isDarkTheme ? 'Activar modo claro' : 'Activar modo oscuro'"
        class="p-button-rounded p-button-text"
        >
        </Button>
        <Button
            :icon="`pi ${screenTogglerIcon}`"
            @click="onScreenToggler"
            :aria-label="isFullScreen ? 'Activar modo claro' : 'Activar modo oscuro'"
            class="p-button-rounded p-button-text"
        >
        </Button>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';


const themeTogglerIcon = ref('pi-moon');
const screenTogglerIcon = ref('pi-window-maximize');
const isDarkTheme = ref(false);
const isFullScreen = ref(false);

const onSearch = (event: Event) => {
    const value = (event.target as HTMLInputElement).value;
    console.log(value);
};

// Initialize theme from localStorage or system preference
onMounted(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
        applyTheme(savedTheme === 'dark');
    } else {
        // Check system preference
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        applyTheme(prefersDark);
    }
});

const applyTheme = (dark: boolean) => {
    const root = document.getElementsByTagName('html')[0];
    isDarkTheme.value = dark;
    
    if (dark) {
        root.classList.add('dark');
        themeTogglerIcon.value = 'pi-sun';
    } else {
        root.classList.remove('dark');
        themeTogglerIcon.value = 'pi-moon';
    }
    
    // Save preference
    localStorage.setItem('theme', dark ? 'dark' : 'light');
};

const onThemeToggler = () => {
    applyTheme(!isDarkTheme.value);
};
const onScreenToggler = () => {
    const root = document.documentElement;
    isFullScreen.value = !isFullScreen.value;
    
    if (isFullScreen.value) {
        root.requestFullscreen();
        screenTogglerIcon.value = 'pi-window-minimize';
    } else {
        document.exitFullscreen();
        screenTogglerIcon.value = 'pi-window-maximize';
    }
};

</script>