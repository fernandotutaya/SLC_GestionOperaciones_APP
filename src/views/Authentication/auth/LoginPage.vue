<script setup lang="ts">
import { ref, reactive, computed } from 'vue'
import { useVuelidate } from '@vuelidate/core'
import { required } from '@vuelidate/validators'
import { useRouter, useRoute } from 'vue-router'
import axios from 'axios'
import { useAuthStore } from '@/stores/AuthStore'

interface LoginFormData {
  companyName: string;
  companyPassword: string;
}

// Router
const router = useRouter()
const route = useRoute()
const authStore = useAuthStore()

// Estado del formulario
const formData = reactive<LoginFormData>({
  companyName: '',
  companyPassword: ''
})

// Estados de control
const loading = ref(false)
const submitted = ref(false)
const errorMessage = ref('')
const showForgotPassword = ref(false)
const showVerificationCode = ref(false)
const forgotPasswordEmail = ref('')
const verificationCode = ref('')
const newPassword = ref('')

// Validaciones
const rules = computed(() => ({
  formData: {
    companyName: { required },
    companyPassword: { required }
  }
}))

const v$ = useVuelidate(rules, { formData })

// Manejadores de eventos
const handleSubmit = async () => {
  submitted.value = true
  const isFormValid = await v$.value.$validate()
  
  if (!isFormValid) return

  try {
    loading.value = true
    errorMessage.value = ''
    await authStore.login(formData.companyName, formData.companyPassword) // Esperar a que la acción de inicio de sesión se complete
    
    // Redireccionar al dashboard
    const redirectTo = Array.isArray(route.query.redirect) ? route.query.redirect[0] : route.query.redirect || '/app'
    if (typeof redirectTo === 'string') {
      router.push(redirectTo)
    }
  } catch (error: any) {
    errorMessage.value = error.response?.data?.message || 'Error al iniciar sesión'
  } finally {
    loading.value = false
  }
}

const handleRequestCode = async () => {
  if (!forgotPasswordEmail.value) {
    errorMessage.value = 'Ingresa tu email'
    return
  }

  try {
    loading.value = true
    errorMessage.value = ''

    await axios.post('http://localhost:8080/api/auth/request-verification-code', {
      email: forgotPasswordEmail.value
    })

    showVerificationCode.value = true
  } catch (error: any) {
    errorMessage.value = error.response?.data?.message || 'Error al solicitar el código'
  } finally {
    loading.value = false
  }
}

const handleResetPassword = async () => {
  if (!verificationCode.value || !newPassword.value) {
    errorMessage.value = 'Todos los campos son requeridos'
    return
  }

  try {
    loading.value = true
    errorMessage.value = ''

    await axios.post('http://localhost:8080/api/auth/forget-password', {
      email: forgotPasswordEmail.value,
      verificationCode: verificationCode.value,
      newPassword: newPassword.value
    })

    // Mostrar mensaje de éxito y volver al login
    resetForgotPassword()
  } catch (error: any) {
    errorMessage.value = error.response?.data?.message || 'Error al cambiar la contraseña'
  } finally {
    loading.value = false
  }
}

const resetForgotPassword = () => {
  showForgotPassword.value = false
  showVerificationCode.value = false
  forgotPasswordEmail.value = ''
  verificationCode.value = ''
  newPassword.value = ''
  errorMessage.value = ''
}
</script>

<template>
  <div class="min-h-screen bg-gray-50 flex items-center justify-center p-4">
    <div class="max-w-md w-full">
      <!-- Card Principal -->
      <Card class="shadow-xl">
        <template #title>
          <div class="text-center">
            <h1 class="text-2xl font-bold text-gray-800">Iniciar Sesión</h1>
            <p class="text-sm text-gray-600 mt-2">Accede a tu cuenta empresarial</p>
          </div>
        </template>
        
        <template #content>
          <form @submit.prevent="handleSubmit" class="space-y-6" v-if="!showForgotPassword">
            <div class="space-y-4">
              <!-- Usuario -->
              <div class="flex flex-col gap-2">
                <label class="text-sm font-medium text-gray-700">Usuario</label>
                <InputText 
                  v-model="formData.companyName"
                  placeholder="Nombre de usuario"
                  :class="{'p-invalid': v$.formData.companyName.$invalid && submitted}"
                />
                <small class="text-red-500" v-if="v$.formData.companyName.$invalid && submitted">
                  El usuario es requerido
                </small>
              </div>

              <!-- Contraseña -->
              <div class="flex flex-col gap-2">
                <label class="text-sm font-medium text-gray-700">Contraseña</label>
                <Password 
                  v-model="formData.companyPassword"
                  :feedback="false"
                  toggleMask
                  placeholder="Ingresa tu contraseña"
                  :class="{'p-invalid': v$.formData.companyPassword.$invalid && submitted}"
                />
                <small class="text-red-500" v-if="v$.formData.companyPassword.$invalid && submitted">
                  La contraseña es requerida
                </small>
              </div>
            </div>

            <!-- Error Message -->
            <div v-if="errorMessage" class="bg-red-50 text-red-500 p-3 rounded-lg text-sm">
              {{ errorMessage }}
            </div>

            <!-- Botón Login -->
            <Button 
              type="submit"
              label="Iniciar Sesión"
              :loading="loading"
              class="w-full"
            />

            <!-- Links Adicionales -->
            <div class="flex justify-between text-sm pt-4">
              <a 
                href="#" 
                class="text-primary-600 hover:text-primary-500"
                @click.prevent="showForgotPassword = true"
              >
                ¿Olvidaste tu contraseña?
              </a>
              <router-link 
                to="/auth/register" 
                class="text-primary-600 hover:text-primary-500"
              >
                Crear cuenta
              </router-link>
            </div>
          </form>

          <!-- Formulario de Contraseña Olvidada -->
          <div v-else class="space-y-6">
            <div v-if="!showVerificationCode" class="space-y-4">
              <div class="flex flex-col gap-2">
                <label class="text-sm font-medium text-gray-700">Email</label>
                <InputText 
                  v-model="forgotPasswordEmail"
                  type="email"
                  placeholder="Ingresa tu email"
                />
              </div>

              <Button 
                @click="handleRequestCode"
                label="Solicitar Código"
                :loading="loading"
                class="w-full"
              />
            </div>

            <div v-else class="space-y-4">
              <div class="flex flex-col gap-2">
                <label class="text-sm font-medium text-gray-700">Código de Verificación</label>
                <InputText 
                  v-model="verificationCode"
                  placeholder="Ingresa el código"
                  class="text-center tracking-wider"
                  maxlength="6"
                />
              </div>

              <div class="flex flex-col gap-2">
                <label class="text-sm font-medium text-gray-700">Nueva Contraseña</label>
                <Password 
                  v-model="newPassword"
                  :feedback="false"
                  toggleMask
                  placeholder="Ingresa tu nueva contraseña"
                />
              </div>

              <Button 
                @click="handleResetPassword"
                label="Cambiar Contraseña"
                :loading="loading"
                class="w-full"
              />
            </div>

            <!-- Error Message -->
            <div v-if="errorMessage" class="bg-red-50 text-red-500 p-3 rounded-lg text-sm">
              {{ errorMessage }}
            </div>

            <!-- Volver al Login -->
            <div class="text-center">
              <a 
                href="#" 
                class="text-sm text-primary-600 hover:text-primary-500"
                @click.prevent="resetForgotPassword"
              >
                Volver al inicio de sesión
              </a>
            </div>
          </div>
        </template>
      </Card>
    </div>
  </div>
</template>

