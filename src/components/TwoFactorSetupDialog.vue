<template>
  <div 
    v-if="modelValue" 
    class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
    @click.self="handleOutsideClick"
  >
    <div class="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-md w-full mx-4">
      <div class="flex justify-between items-center mb-4">
        <h4 class="text-lg font-medium text-gray-900 dark:text-white">2FA Instellen</h4>
        <button 
          @click="handleClose"
          class="text-gray-400 hover:text-gray-600 dark:hover:text-white"
        >
          <span class="material-icons">close</span>
        </button>
      </div>
      <div class="space-y-4">
        <p class="text-gray-600 dark:text-gray-300">
          1. Scan de QR code met je authenticator app (Google Authenticator, Microsoft Authenticator, etc.)
        </p>
        <div class="flex justify-center bg-white p-4 rounded-lg">
          <img 
            :src="typeof setup.qrCode === 'string' ? setup.qrCode : `data:image/png;base64,${(setup.qrCode as QRCodeResponse).data || setup.qrCode}`"
            alt="2FA QR Code" 
            class="w-48 h-48"
            @error="handleImageError"
          />
        </div>
        
        <!-- Manual Setup Key -->
        <div class="mt-4">
          <p class="text-gray-600 dark:text-gray-300 mb-2">
            Of voer handmatig deze setup key in:
          </p>
          <div class="flex items-center gap-2">
            <input
              type="text"
              :value="setup.secret"
              readonly
              class="flex-1 px-3 py-2 bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded text-gray-900 dark:text-white font-mono"
            />
            <button
              @click="handleCopyKey"
              class="px-3 py-2 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
              title="Kopieer naar klembord"
            >
              <span class="material-icons">content_copy</span>
            </button>
          </div>
        </div>

        <p class="text-gray-600 dark:text-gray-300">
          2. Voer de 6-cijferige code in van je authenticator app
        </p>
        <div class="flex gap-2">
          <input
            v-model="verificationCode"
            type="text"
            maxlength="6"
            placeholder="000000"
            class="flex-1 px-3 py-2 bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded focus:outline-none focus:border-slack-purple text-gray-900 dark:text-white"
          />
          <button
            @click="handleVerify"
            class="px-4 py-2 bg-slack-purple text-white rounded hover:bg-slack-pink transition-colors"
          >
            Verifiëren
          </button>
        </div>
        <div class="flex justify-end gap-2 mt-4">
          <button
            @click="handleClose"
            class="px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
          >
            Annuleren
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useToast } from 'vue-toastification'

interface QRCodeResponse {
  data?: string;
  [key: string]: any;
}

interface TwoFactorSetupResponse {
  secret: string;
  qrCode: string | QRCodeResponse;
  backupCodes: string[];
}

const props = defineProps<{
  modelValue: boolean;
  setup: TwoFactorSetupResponse;
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean): void;
  (e: 'verify', code: string): void;
}>()

const toast = useToast()
const verificationCode = ref('')

const handleClose = () => {
  emit('update:modelValue', false)
  verificationCode.value = ''
}

const handleOutsideClick = () => {
  handleClose()
}

const handleVerify = () => {
  if (!verificationCode.value) {
    toast.error('Voer de verificatiecode in')
    return
  }
  emit('verify', verificationCode.value)
}

const handleCopyKey = async () => {
  try {
    await navigator.clipboard.writeText(props.setup.secret)
    toast.success('Setup key gekopieerd naar klembord')
  } catch (err) {
    console.error('Failed to copy:', err)
    toast.error('Kon setup key niet kopiëren')
  }
}

const handleImageError = (error: any) => {
  console.error('QR Code loading error:', error)
}
</script> 