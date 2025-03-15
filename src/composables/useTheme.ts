import { ref } from 'vue';

const isDarkTheme = ref(false);

export function useTheme() {
    const toggleTheme = () => {
        isDarkTheme.value = !isDarkTheme.value;
        
        if (isDarkTheme.value) {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
    };

    return {
        isDarkTheme,
        toggleTheme
    };
} 