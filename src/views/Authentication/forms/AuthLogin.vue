<template>
  <div class="p-4">
    <h2 class="text-2xl mb-4">Login</h2>
    <form @submit.prevent="login">
      <div class="mb-4">
        <label for="companyName">Company Name</label>
        <input v-model="form.companyName" id="companyName" type="text" class="p-inputtext p-component" required />
      </div>
      <div class="mb-4">
        <label for="companyPassword">Password</label>
        <input v-model="form.companyPassword" id="companyPassword" type="password" class="p-inputtext p-component" required />
      </div>
      <button type="submit" class="p-button p-component">Login</button>
    </form>
  </div>
</template>

<script setup lang="ts">
import { reactive } from 'vue';
import { useAuthStore } from '@/stores/AuthStore';

const authStore = useAuthStore();
const form = reactive({
  companyName: '',
  companyPassword: '',
});

const login = async () => {
  await authStore.login(form.companyName, form.companyPassword);
};
</script>

<style scoped>
/* Add your styles here */
</style>
