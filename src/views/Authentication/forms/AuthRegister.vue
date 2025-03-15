<template>
  <div class="p-4">
    <h2 class="text-2xl mb-4">Register</h2>
    <form @submit.prevent="register">
      <!-- Form fields for registration -->
      <div class="mb-4">
        <label for="nombreLegal">Legal Name</label>
        <input v-model="form.nombreLegal" id="nombreLegal" type="text" class="p-inputtext p-component" required />
      </div>
      <div class="mb-4">
        <label for="companyName">Company Name</label>
        <input v-model="form.companyName" id="companyName" type="text" class="p-inputtext p-component" required />
      </div>
      <div class="mb-4">
        <label for="companyPassword">Password</label>
        <input v-model="form.companyPassword" id="companyPassword" type="password" class="p-inputtext p-component" required />
      </div>
      <div class="mb-4">
        <label for="email">Email</label>
        <input v-model="form.email" id="email" type="email" class="p-inputtext p-component" required />
      </div>
      <!-- Additional fields can be added here -->
      <button type="submit" class="p-button p-component">Register</button>
    </form>
  </div>
</template>

<script setup lang="ts">
import { reactive } from 'vue';
import { useAuthStore } from '@/stores/AuthStore';

const authStore = useAuthStore();
const form = reactive({
  nombreLegal: '',
  companyName: '',
  companyPassword: '',
  email: '',
});

const register = async () => {
  await authStore.register(form);
};
</script>

<style scoped>
/* Add your styles here */
</style>
