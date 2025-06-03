<template>
  <div v-if="isOpen" class="fixed inset-0 z-50 overflow-y-auto">
    <div class="flex items-center justify-center min-h-screen px-4">
      <!-- Backdrop -->
      <div class="fixed inset-0 bg-black bg-opacity-50 transition-opacity" @click="$emit('close')"></div>

      <!-- Modal -->
      <div class="relative bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-2xl w-full">
        <!-- Header -->
        <div class="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <h3 class="text-lg font-medium text-gray-900 dark:text-white">Nieuw bericht</h3>
          <button 
            @click="$emit('close')"
            class="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300"
          >
            <span class="material-icons">close</span>
          </button>
        </div>

        <!-- Content -->
        <div class="p-6">
          <form @submit.prevent="handleSubmit" class="space-y-4">
            <!-- Recipient Type -->
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Ontvanger type
              </label>
              <div class="flex space-x-4">
                <button
                  type="button"
                  @click="recipientType = 'user'"
                  class="flex-1 px-4 py-2 rounded-lg border"
                  :class="recipientType === 'user' 
                    ? 'border-slack-purple bg-slack-purple/10 dark:bg-slack-purple/20 text-slack-purple dark:text-slack-purple' 
                    : 'border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'"
                >
                  <span class="material-icons mr-2">person</span>
                  Gebruiker
                </button>
                <button
                  type="button"
                  @click="recipientType = 'email'"
                  class="flex-1 px-4 py-2 rounded-lg border"
                  :class="recipientType === 'email' 
                    ? 'border-slack-purple bg-slack-purple/10 dark:bg-slack-purple/20 text-slack-purple dark:text-slack-purple' 
                    : 'border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'"
                >
                  <span class="material-icons mr-2">email</span>
                  E-mail
                </button>
              </div>
            </div>

            <!-- Recipient Selection -->
            <div v-if="recipientType === 'user'">
              <label for="recipient" class="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Ontvanger
              </label>
              <select
                id="recipient"
                v-model="formData.receiver_id"
                class="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-slack-purple focus:ring-slack-purple dark:bg-gray-700 dark:text-white"
                required
              >
                <option value="">Selecteer ontvanger</option>
                <option v-for="user in users" :key="user.id" :value="user.id">
                  {{ user.name }}
                </option>
              </select>
            </div>

            <div v-else>
              <label for="email" class="block text-sm font-medium text-gray-700 dark:text-gray-300">
                E-mailadres
              </label>
              <input
                type="email"
                id="email"
                v-model="formData.email"
                class="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-slack-purple focus:ring-slack-purple dark:bg-gray-700 dark:text-white"
                required
              />
            </div>

            <!-- CC -->
            <div>
              <label for="cc" class="block text-sm font-medium text-gray-700 dark:text-gray-300">
                CC
              </label>
              <div class="mt-1 flex flex-wrap gap-2 p-2 border border-gray-300 dark:border-gray-600 rounded-md">
                <div 
                  v-for="(cc, index) in formData.cc" 
                  :key="index"
                  class="flex items-center bg-gray-100 dark:bg-gray-700 rounded-full px-3 py-1"
                >
                  <span class="text-sm">{{ cc }}</span>
                  <button 
                    type="button"
                    @click="removeCC(index)"
                    class="ml-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                  >
                    <span class="material-icons text-sm">close</span>
                  </button>
                </div>
                <input
                  type="email"
                  v-model="ccInput"
                  @keydown.enter.prevent="addCC"
                  @keydown.backspace="handleBackspace"
                  placeholder="Voeg CC toe..."
                  class="flex-1 min-w-[200px] bg-transparent border-none focus:ring-0 p-0 text-sm"
                />
              </div>
            </div>

            <!-- Subject -->
            <div>
              <label for="subject" class="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Onderwerp
              </label>
              <input
                type="text"
                id="subject"
                v-model="formData.subject"
                class="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-slack-purple focus:ring-slack-purple dark:bg-gray-700 dark:text-white"
                required
              />
            </div>

            <!-- Message -->
            <div>
              <label for="message" class="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Bericht
              </label>
              <textarea
                id="message"
                v-model="formData.content"
                rows="6"
                class="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-slack-purple focus:ring-slack-purple dark:bg-gray-700 dark:text-white"
                required
              ></textarea>
            </div>

            <!-- Actions -->
            <div class="flex justify-end space-x-3 pt-4">
              <button
                type="button"
                @click="$emit('close')"
                class="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg"
              >
                Annuleren
              </button>
              <button
                type="submit"
                class="px-4 py-2 text-sm font-medium text-white bg-slack-purple hover:bg-slack-pink rounded-lg focus:outline-none focus:ring-2 focus:ring-slack-purple focus:ring-offset-2"
                :disabled="isSending"
              >
                <span v-if="isSending">Versturen...</span>
                <span v-else>Versturen</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { useMessagesStore } from '../stores/messages'

const props = defineProps<{
  isOpen: boolean
}>()

const emit = defineEmits<{
  (e: 'close'): void
  (e: 'sent'): void
}>()

const store = useMessagesStore()
const isSending = ref(false)
const recipientType = ref<'user' | 'email'>('user')
const ccInput = ref('')

// Temporary user list - replace with actual user fetching
const users = ref([
  { id: 1, name: 'Test User 1' },
  { id: 2, name: 'Test User 2' }
])

const formData = ref({
  receiver_id: 0,
  email: '',
  cc: [] as string[],
  subject: '',
  content: ''
})

// Reset form when modal opens/closes
watch(() => props.isOpen, (newValue) => {
  if (!newValue) {
    formData.value = {
      receiver_id: 0,
      email: '',
      cc: [],
      subject: '',
      content: ''
    }
    recipientType.value = 'user'
    ccInput.value = ''
  }
})

function addCC() {
  if (ccInput.value && !formData.value.cc.includes(ccInput.value)) {
    formData.value.cc.push(ccInput.value)
    ccInput.value = ''
  }
}

function removeCC(index: number) {
  formData.value.cc.splice(index, 1)
}

function handleBackspace(e: KeyboardEvent) {
  if (e.key === 'Backspace' && !ccInput.value && formData.value.cc.length > 0) {
    formData.value.cc.pop()
  }
}

async function handleSubmit() {
  if (isSending.value) return

  isSending.value = true
  try {
    if (recipientType.value === 'user') {
      await store.sendMessage({
        receiver_id: formData.value.receiver_id,
        content: formData.value.content,
        subject: formData.value.subject,
        cc: formData.value.cc
      })
    } else {
      // TODO: Implement email sending
      console.log('Sending email:', {
        to: formData.value.email,
        cc: formData.value.cc,
        subject: formData.value.subject,
        content: formData.value.content
      })
    }
    emit('sent')
    emit('close')
  } catch (error) {
    console.error('Error sending message:', error)
  } finally {
    isSending.value = false
  }
}
</script> 