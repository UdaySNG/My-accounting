<template>
  <div v-if="isOpen" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div class="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-md p-6">
      <div class="flex justify-between items-center mb-4">
        <h2 class="text-xl font-semibold">
          {{ appointment && 'id' in appointment ? 'Afspraak bewerken' : 'Afspraak aanmaken' }}
        </h2>
        <button @click="close" class="text-gray-500 hover:text-gray-700">
          <span class="material-icons">close</span>
        </button>
      </div>

      <form @submit.prevent="handleSubmit" class="space-y-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Titel
          </label>
          <input
            v-model="form.title"
            type="text"
            required
            class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-slack-purple focus:border-slack-purple dark:bg-gray-700 dark:text-white"
          />
        </div>

        <div class="grid grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Start
            </label>
            <input
              v-model="form.start"
              type="datetime-local"
              required
              class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-slack-purple focus:border-slack-purple dark:bg-gray-700 dark:text-white"
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Eind
            </label>
            <input
              v-model="form.end"
              type="datetime-local"
              required
              class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-slack-purple focus:border-slack-purple dark:bg-gray-700 dark:text-white"
            />
          </div>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Type
          </label>
          <select
            v-model="form.type"
            class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-slack-purple focus:border-slack-purple dark:bg-gray-700 dark:text-white"
          >
            <option value="meeting">Meeting</option>
            <option value="call">Telefoongesprek</option>
            <option value="other">Anders</option>
          </select>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Beschrijving
          </label>
          <textarea
            v-model="form.description"
            rows="3"
            class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-slack-purple focus:border-slack-purple dark:bg-gray-700 dark:text-white"
          ></textarea>
        </div>

        <div class="flex justify-end space-x-3">
          <button
            type="button"
            @click="close"
            class="px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
          >
            Annuleren
          </button>
          <button
            type="submit"
            class="px-4 py-2 bg-slack-purple text-white rounded-lg hover:bg-slack-pink"
          >
            {{ appointment ? 'Opslaan' : 'Toevoegen' }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import type { Appointment } from '../services/appointments'

const props = defineProps<{
  isOpen: boolean
  appointment?: Appointment | null
}>()

const emit = defineEmits<{
  (e: 'close'): void
  (e: 'save', appointment: Omit<Appointment, 'id'>): void
}>()

const form = ref({
  title: '',
  start: '',
  end: '',
  type: 'meeting' as 'meeting' | 'call' | 'other',
  description: '',
  color: '#3B82F6'
})

watch(() => props.appointment, (newAppointment) => {
  if (newAppointment) {
    form.value = {
      title: newAppointment.title,
      start: newAppointment.start.toISOString().slice(0, 16),
      end: newAppointment.end.toISOString().slice(0, 16),
      type: newAppointment.type,
      description: newAppointment.description || '',
      color: newAppointment.color || '#3B82F6'
    }
  } else {
    form.value = {
      title: '',
      start: '',
      end: '',
      type: 'meeting' as 'meeting' | 'call' | 'other',
      description: '',
      color: '#3B82F6'
    }
  }
}, { immediate: true })

function handleSubmit() {
  const startDate = new Date(form.value.start)
  const endDate = new Date(form.value.end)
  
  emit('save', {
    title: form.value.title,
    description: form.value.description,
    start: startDate,
    end: endDate,
    start_time: startDate.toISOString(),
    end_time: endDate.toISOString(),
    type: form.value.type,
    status: 'scheduled',
    color: form.value.color
  })
}

function close() {
  emit('close')
}
</script> 