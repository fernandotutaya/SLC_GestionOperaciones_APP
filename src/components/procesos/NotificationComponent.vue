<script setup lang="ts">
import { ref, watch } from 'vue';

const props = defineProps<{
  type: 'success' | 'error' | 'info' | 'warning';
  message: string;
}>();

const show = ref(true);
const timeout = ref();

const typeStyles = {
  success: 'bg-green-100 border-green-400 text-green-700',
  error: 'bg-red-100 border-red-400 text-red-700',
  info: 'bg-blue-100 border-blue-400 text-blue-700',
  warning: 'bg-yellow-100 border-yellow-400 text-yellow-700'
};

watch(() => props.message, () => {
  show.value = true;
  clearTimeout(timeout.value);
  timeout.value = setTimeout(() => show.value = false, 5000);
});
</script>

<template>
  <Transition name="slide-fade">
    <div 
      v-if="show && message"
      class="fixed bottom-4 right-4 p-4 rounded-lg border-l-4 shadow-lg"
      :class="typeStyles[type]"
      role="alert"
    >
      <div class="flex items-center gap-3">
        <i 
          class="text-xl"
          :class="{
            'pi pi-check-circle': type === 'success',
            'pi pi-times-circle': type === 'error',
            'pi pi-info-circle': type === 'info',
            'pi pi-exclamation-triangle': type === 'warning'
          }"
        />
        <div class="flex-1">
          <p class="font-medium">{{ message }}</p>
        </div>
        <Button 
          icon="pi pi-times" 
          text 
          @click="show = false"
        />
      </div>
    </div>
  </Transition>
</template>

<style>
.slide-fade-enter-active {
  transition: all 0.3s ease-out;
}

.slide-fade-leave-active {
  transition: all 0.3s cubic-bezier(1, 0.5, 0.8, 1);
}

.slide-fade-enter-from,
.slide-fade-leave-to {
  transform: translateX(20px);
  opacity: 0;
}
</style>