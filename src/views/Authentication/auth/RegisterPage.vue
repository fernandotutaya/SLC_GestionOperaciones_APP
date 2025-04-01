<template>
  <div class="card flex justify-center items-center h-screen">
    <!-- Añadir componente Toast para mostrar notificaciones -->
    <Toast />
    
    <div class="max-w-4xl mx-auto bg-white rounded-xl shadow-lg p-6">
      <Stepper v-model:value="currentStep" class="basis-[50rem]">
        <StepList>
          <Step value="1">Información Básica</Step>
          <Step value="2">Información Legal</Step>
          <Step value="3">Información Adicional</Step>
          <Step value="4">Verificación</Step>
        </StepList>
  
        <StepPanels>
          <!-- Panel 1: Información Básica -->
          <StepPanel v-slot="{ activateCallback }" value="1">
            <div class="flex flex-col space-y-6 p-4">
              <h2 class="text-xl font-semibold">Información Básica de la Empresa</h2>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div class="flex flex-col">
                  <label class="text-sm font-medium mb-2">Nombre de Usuario</label>
                  <InputText 
                    v-model="formData.companyName"
                    :class="{'p-invalid': v$.step1.companyName.$invalid && submitted}"
                    placeholder="ej: lavanderiaexpress"
                  />
                  <small class="p-error" v-if="v$.step1.companyName.$invalid && submitted">
                    El nombre de usuario es requerido
                  </small>
                </div>
                <div class="flex flex-col">
                  <label class="text-sm font-medium mb-2">Correo Electrónico</label>
                  <InputText 
                    v-model="formData.email"
                    type="email"
                    :class="{'p-invalid': v$.step1.email.$invalid && submitted}"
                    placeholder="contacto@empresa.com"
                  />
                  <small class="p-error" v-if="v$.step1.email.$invalid && submitted">
                    Ingrese un correo válido
                  </small>
                </div>
                <div class="flex flex-col">
                  <label class="text-sm font-medium mb-2">Contraseña</label>
                  <Password 
                    v-model="formData.companyPassword"
                    toggleMask
                    :class="{'p-invalid': v$.step1.companyPassword.$invalid && submitted}"
                  />
                  <small class="p-error" v-if="v$.step1.companyPassword.$invalid && submitted">
                    La contraseña debe tener al menos 8 caracteres
                  </small>
                </div>
                <div class="flex flex-col">
                  <label class="text-sm font-medium mb-2">Confirmar Contraseña</label>
                  <Password 
                    v-model="formData.confirmPassword"
                    toggleMask
                    :class="{'p-invalid': v$.step1.confirmPassword.$invalid && submitted}"
                  />
                  <small class="p-error" v-if="v$.step1.confirmPassword.$invalid && submitted">
                    Las contraseñas no coinciden
                  </small>
                </div>
              </div>
              <div class="flex justify-end pt-6">
                <Button 
                  label="Siguiente" 
                  icon="pi pi-arrow-right" 
                  iconPos="right" 
                  @click="handleNextStep(activateCallback)"
                />
              </div>
            </div>
          </StepPanel>
  
          <!-- Panel 2: Información Legal -->
          <StepPanel v-slot="{ activateCallback }" value="2">
            <div class="flex flex-col space-y-6 p-4">
              <h2 class="text-xl font-semibold">Información Legal</h2>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div class="flex flex-col">
                  <label class="text-sm font-medium mb-2">Nombre Legal</label>
                  <InputText 
                    v-model="formData.nombreLegal"
                    :class="{'p-invalid': v$.step2.nombreLegal.$invalid && submitted}"
                    placeholder="ej: Lavandería Express S.A.C."
                  />
                  <small class="p-error" v-if="v$.step2.nombreLegal.$invalid && submitted">
                    El nombre legal es requerido
                  </small>
                </div>
                <div class="flex flex-col">
                  <label class="text-sm font-medium mb-2">RUC</label>
                  <InputText 
                    v-model="formData.ruc"
                    :class="{'p-invalid': v$.step2.ruc.$invalid && submitted}"
                    placeholder="20123456789"
                  />
                  <small class="p-error" v-if="v$.step2.ruc.$invalid && submitted">
                    Ingrese un RUC válido
                  </small>
                </div>
                <div class="flex flex-col">
                  <label class="text-sm font-medium mb-2">Dirección</label>
                  <InputText 
                    v-model="formData.direccion"
                    placeholder="Av. Industrial 123, Lima"
                  />
                </div>
                <div class="flex flex-col">
                  <label class="text-sm font-medium mb-2">Teléfono</label>
                  <InputText 
                    v-model="formData.telefono"
                    placeholder="987654321"
                  />
                </div>
              </div>
              <div class="flex justify-between pt-6">
                <Button 
                  label="Anterior" 
                  severity="secondary" 
                  icon="pi pi-arrow-left"
                  @click="activateCallback('1')" 
                />
                <Button 
                  label="Siguiente" 
                  icon="pi pi-arrow-right" 
                  iconPos="right" 
                  @click="handleNextStep(activateCallback)"
                />
              </div>
            </div>
          </StepPanel>
  
          <!-- Panel 3: Información Adicional -->
          <StepPanel v-slot="{ activateCallback }" value="3">
            <div class="flex flex-col space-y-6 p-4">
              <h2 class="text-xl font-semibold">Información Adicional</h2>
              <div class="space-y-6">
                <div class="flex flex-col">
                  <label class="text-sm font-medium mb-2">Plan</label>
                  <Dropdown
                    v-model="formData.plan"
                    :options="planes"
                    optionLabel="name"
                    optionValue="code"
                    placeholder="Seleccione un plan"
                    class="w-full"
                  />
                </div>
                <div class="flex flex-col">
                  <label class="text-sm font-medium mb-2">Logo de la Empresa</label>
                  <FileUpload
                    mode="basic"
                    :maxFileSize="1000000"
                    accept="image/*"
                    @upload="handleLogoUpload"
                    auto
                    chooseLabel="Seleccionar Logo"
                  />
                </div>
                <div class="flex flex-col">
                  <label class="text-sm font-medium mb-2">Descripción</label>
                  <Textarea 
                    v-model="formData.descripcion"
                    rows="4"
                    placeholder="Describa brevemente su empresa..."
                  />
                </div>
              </div>
              <div class="flex justify-between pt-6">
                <Button 
                  label="Anterior" 
                  severity="secondary" 
                  icon="pi pi-arrow-left"
                  @click="activateCallback('2')" 
                />
                <Button 
                  label="Siguiente" 
                  icon="pi pi-arrow-right" 
                  iconPos="right" 
                  @click="handleNextStep(activateCallback)"
                />
              </div>
            </div>
          </StepPanel>
  
          <!-- Panel 4: Verificación -->
          <StepPanel v-slot="{ activateCallback }" value="4">
            <div class="flex flex-col space-y-6 p-4">
              <h2 class="text-xl font-semibold">Verificación de Email</h2>
              <div class="space-y-6">
                <Message severity="info" class="w-full">
                  <span>Se ha enviado un código de verificación a su correo electrónico.
                  Por favor, revise su bandeja de entrada e ingrese el código a continuación.</span>
                </Message>
                <div class="flex flex-col max-w-xs mx-auto">
                  <label class="text-sm font-medium mb-2">Código de Verificación</label>
                  <InputText 
                    v-model="verificationCode"
                    placeholder="Ingrese el código"
                    class="text-center text-2xl tracking-wide"
                    maxlength="6"
                  />
                </div>
                <div class="text-center">
                  <Button 
                    label="Reenviar Código"
                    link
                    @click="requestNewCode"
                  />
                </div>
              </div>
              <div class="flex justify-between pt-6">
                <Button 
                  label="Anterior" 
                  severity="secondary" 
                  icon="pi pi-arrow-left"
                  @click="activateCallback('3')" 
                />
                <Button 
                  label="Finalizar" 
                  icon="pi pi-check"
                  :loading="loading"
                  @click="handleSubmit"
                />
              </div>
            </div>
          </StepPanel>
        </StepPanels>
      </Stepper>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { useVuelidate } from '@vuelidate/core'
import { required, email, minLength, sameAs } from '@vuelidate/validators'
import type { FileUploadUploaderEvent } from 'primevue/fileupload'
import { useAuthStore } from '@/stores/AuthStore'
import { useToast } from 'primevue/usetoast'
import { useRouter } from 'vue-router'

interface Plan {
  name: string;
  code: string;
}

interface FormData {
  companyName: string;
  email: string;
  companyPassword: string;
  confirmPassword: string;
  nombreLegal: string;
  ruc: string;
  direccion: string;
  telefono: string;
  plan: string;
  logoUrl: string;
  descripcion: string;
  estado: boolean;
  sucursales: string[];
}

const currentStep = ref<string>('1')
const loading = ref<boolean>(false)
const submitted = ref<boolean>(false)
const verificationCode = ref<string>('')
const authStore = useAuthStore()
const toast = useToast()
const router = useRouter()

const formData = reactive({
  companyName: '',
  email: '',
  companyPassword: '',
  confirmPassword: '',
  nombreLegal: '',
  ruc: '',
  direccion: '',
  telefono: '',
  plan: '',
  logoUrl: '',
  descripcion: '',
  estado: true,
  sucursales: []
})

const planes = [
  { name: 'Básico', code: 'basic' },
  { name: 'Premium', code: 'premium' },
  { name: 'Enterprise', code: 'enterprise' }
]

const rules = {
  // Step 1 rules
  step1: {
    companyName: { required },
    email: { required, email },
    companyPassword: { required, minLength: minLength(8) },
    confirmPassword: { 
      required, 
      sameAsPassword: () => sameAs(formData.companyPassword)
    }
  },
  // Step 2 rules
  step2: {
    nombreLegal: { required },
    ruc: { required, minLength: minLength(11) }
  },
  // Step 3 rules - no validation required for now
  step3: {}
}

// Crear un validador compuesto
const v$ = useVuelidate(rules, { 
  step1: formData, 
  step2: formData,
  step3: formData
})

const handleNextStep = async (activateCallback: (step: string) => void) => {
  submitted.value = true
  
  // Determinar qué conjunto de reglas validar según el paso actual
  let currentRules;
  if (currentStep.value === '1') currentRules = v$.value.step1;
  else if (currentStep.value === '2') currentRules = v$.value.step2;
  else if (currentStep.value === '3') currentRules = v$.value.step3;
  else currentRules = v$.value.step1; // Valor por defecto para evitar undefined
  
  // Validar solo las reglas del paso actual
  const isStepValid = await currentRules.$validate()
  
  // Añadir log para diagnóstico
  console.log('Validación del formulario:', isStepValid)
  if (!isStepValid) {
    console.log('Errores de validación:', currentRules.$errors)
  }
  
  if (isStepValid) {
    const nextStep = (parseInt(currentStep.value) + 1).toString()
    if (currentStep.value === '1') {
      try {
        loading.value = true
        await authStore.requestVerificationCode(formData.email)
        toast.add({ severity: 'success', summary: 'Código enviado', detail: 'Se ha enviado un código de verificación a su correo electrónico', life: 3000 })
        activateCallback(nextStep)
      } catch (error) {
        console.error('Error:', error)
        toast.add({ severity: 'error', summary: 'Error', detail: 'No se pudo enviar el código de verificación', life: 3000 })
      } finally {
        loading.value = false
      }
    } else {
      activateCallback(nextStep)
    }
  }
}

const handleSubmit = async () => {
  if (!verificationCode.value) {
    toast.add({ severity: 'warn', summary: 'Advertencia', detail: 'Ingrese el código de verificación', life: 3000 })
    return
  }
  
  loading.value = true
  try {
    // Verificar el código
    try {
      await authStore.verifyEmail(formData.email, verificationCode.value)
    } catch (verifyError: any) {
      // Manejo específico para errores de verificación
      console.error('Error de verificación:', verifyError)
      
      if (verifyError.response) {
        // Errores de respuesta del servidor
        if (verifyError.response.status === 400) {
          toast.add({ 
            severity: 'error', 
            summary: 'Error de verificación', 
            detail: 'El código de verificación es incorrecto o ha expirado', 
            life: 5000 
          })
        } else if (verifyError.response.status === 404) {
          toast.add({ 
            severity: 'error', 
            summary: 'Error de verificación', 
            detail: 'No se encontró una solicitud de verificación para este correo', 
            life: 5000 
          })
        } else {
          toast.add({ 
            severity: 'error', 
            summary: 'Error de verificación', 
            detail: 'No se pudo verificar el código. Intente solicitar uno nuevo.', 
            life: 5000 
          })
        }
      } else {
        toast.add({ 
          severity: 'error', 
          summary: 'Error de verificación', 
          detail: 'No se pudo verificar el código. Intente solicitar uno nuevo.', 
          life: 5000 
        })
      }
      
      loading.value = false
      return
    }
    
    // Registrar empresa
    try {
      const { confirmPassword, ...registrationData } = formData
      await authStore.registerFull(registrationData)
      
      toast.add({ severity: 'success', summary: 'Éxito', detail: 'Empresa registrada exitosamente', life: 3000 })
      
      // Redireccionar al login después de un breve retraso
      setTimeout(() => {
        router.push('/auth/login')
      }, 2000)
    } catch (registerError: any) {
      // Manejo específico para errores de registro
      console.error('Error de registro:', registerError)
      
      if (registerError.response) {
        // Errores de respuesta del servidor
        if (registerError.response.status === 409) {
          toast.add({ 
            severity: 'error', 
            summary: 'Error de registro', 
            detail: 'El correo electrónico o nombre de usuario ya está registrado', 
            life: 5000 
          })
        } else if (registerError.response.status === 400) {
          let errorMessage = 'Información de registro inválida';
          
          // Si hay un mensaje específico del servidor, lo usamos
          if (registerError.response.data && registerError.response.data.message) {
            errorMessage = registerError.response.data.message;
          }
          
          toast.add({ 
            severity: 'error', 
            summary: 'Error de registro', 
            detail: errorMessage, 
            life: 5000 
          })
        } else {
          toast.add({ 
            severity: 'error', 
            summary: 'Error de registro', 
            detail: 'Ocurrió un problema al registrar la empresa. Por favor, intente nuevamente.', 
            life: 5000 
          })
        }
      } else {
        toast.add({ 
          severity: 'error', 
          summary: 'Error de registro', 
          detail: 'Ocurrió un problema al registrar la empresa. Por favor, intente nuevamente.', 
          life: 5000 
        })
      }
    }
  } catch (error: any) {
    console.error('Error general:', error)
    toast.add({ 
      severity: 'error', 
      summary: 'Error', 
      detail: 'Ocurrió un error inesperado. Por favor, intente nuevamente más tarde.', 
      life: 5000 
    })
  } finally {
    loading.value = false
  }
}

const handleLogoUpload = (event: FileUploadUploaderEvent) => {
  const file = Array.isArray(event.files) ? event.files[0] : null;
  if (file) {
    formData.logoUrl = URL.createObjectURL(file)
  }
}

const requestNewCode = async () => {
  loading.value = true
  try {
    await authStore.requestVerificationCode(formData.email)
    toast.add({ severity: 'success', summary: 'Código enviado', detail: 'Se ha enviado un nuevo código de verificación a su correo electrónico', life: 3000 })
  } catch (error) {
    console.error('Error:', error)
    toast.add({ severity: 'error', summary: 'Error', detail: 'No se pudo enviar el código de verificación', life: 3000 })
  } finally {
    loading.value = false
  }
}
</script>