<template>
  <div class="p-6">
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-2xl font-bold">Agenda</h1>
      <div class="flex space-x-2">
        <button 
          @click="openNewAppointment"
          class="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
        >
          <span class="material-icons align-middle mr-1">add</span>
          Nieuwe Afspraak
        </button>
        <button 
          @click="goToToday"
          class="px-4 py-2 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600"
        >
          <span class="material-icons align-middle">today</span>
        </button>
      </div>
    </div>

    <!-- Calendar Navigation -->
    <div class="flex justify-between items-center mb-4">
      <button 
        @click="previousMonth"
        class="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
      >
        <span class="material-icons">chevron_left</span>
      </button>
      <h2 class="text-xl font-semibold">
        {{ currentMonth.toLocaleDateString('nl-NL', { month: 'long', year: 'numeric' }) }}
      </h2>
      <button 
        @click="nextMonth"
        class="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
      >
        <span class="material-icons">chevron_right</span>
      </button>
    </div>

    <!-- Calendar Grid -->
    <div class="bg-white dark:bg-gray-800 rounded-lg shadow mb-6">
      <!-- Weekday Headers -->
      <div class="grid grid-cols-7 gap-px bg-gray-200 dark:bg-gray-700">
        <div v-for="day in ['Ma', 'Di', 'Wo', 'Do', 'Vr', 'Za', 'Zo']" 
             :key="day" 
             class="p-2 text-center text-sm font-medium text-gray-600 dark:text-gray-300">
          {{ day }}
        </div>
      </div>

      <!-- Calendar Days -->
      <div class="grid grid-cols-7 gap-px bg-gray-200 dark:bg-gray-700">
        <!-- Empty cells for days before the first of the month -->
        <div 
          v-for="n in firstDayOfMonth" 
          :key="`empty-${n}`"
          class="min-h-[120px] bg-white dark:bg-gray-800"
        ></div>

        <!-- Days of the month -->
        <div 
          v-for="day in daysInMonth" 
          :key="day"
          class="min-h-[120px] bg-white dark:bg-gray-800 p-2 relative cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700"
          @click="openNewAppointmentForDay(day)"
        >
          <span 
            class="text-sm font-medium"
            :class="{
              'text-gray-400': !isCurrentMonth,
              'text-gray-600 dark:text-gray-400': isCurrentMonth
            }"
          >
            {{ day }}
          </span>
          
          <!-- Appointments for this day -->
          <div 
            v-for="appointment in getAppointmentsForDay(day)"
            :key="appointment.id"
            class="mt-1 cursor-pointer"
            @click.stop="editAppointment(appointment)"
          >
            <div 
              class="text-xs p-1 rounded mb-1 truncate"
              :style="{ backgroundColor: appointment.color + '20', color: appointment.color }"
            >
              {{ appointment.title }}
              <span class="block text-gray-500">
                {{ formatTime(appointment.start) }}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Upcoming Appointments -->
    <div>
      <h3 class="text-lg font-semibold mb-4">Komende Afspraken</h3>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div 
          v-for="appointment in upcomingAppointments"
          :key="appointment.id"
          class="bg-white dark:bg-gray-800 p-4 rounded-lg shadow"
        >
          <div class="flex items-center justify-between">
            <div>
              <h4 class="font-medium">{{ appointment.title }}</h4>
              <p class="text-sm text-gray-600 dark:text-gray-300">
                {{ formatDateTime(appointment.start) }}
              </p>
              <p class="text-sm text-gray-500 dark:text-gray-400">
                {{ appointment.type === 'meeting' ? 'Meeting' : 
                   appointment.type === 'call' ? 'Telefoongesprek' : 'Anders' }}
              </p>
            </div>
            <div class="flex space-x-2">
              <button 
                @click="editAppointment(appointment)"
                class="text-blue-500 hover:text-blue-600"
              >
                <span class="material-icons">edit</span>
              </button>
              <button 
                @click="deleteAppointment(appointment.id)"
                class="text-red-500 hover:text-red-600"
              >
                <span class="material-icons">delete</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Appointment Modal -->
    <AppointmentModal
      :is-open="isModalOpen"
      :appointment="selectedAppointment"
      @close="closeModal"
      @save="handleSaveAppointment"
    />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useCalendarStore } from '../stores/calendar'
import type { Appointment } from '../stores/calendar'
import AppointmentModal from '../components/AppointmentModal.vue'

const store = useCalendarStore()

// Computed properties
const currentMonth = computed(() => store.currentMonth)
const daysInMonth = computed(() => store.daysInMonth)
const firstDayOfMonth = computed(() => store.firstDayOfMonth)
const isModalOpen = computed(() => store.isModalOpen)
const selectedAppointment = computed(() => store.selectedAppointment)

const upcomingAppointments = computed(() => {
  const now = new Date()
  return store.appointments
    .filter(a => a.start >= now)
    .sort((a, b) => a.start.getTime() - b.start.getTime())
})

// Methods
function getAppointmentsForDay(day: number) {
  const date = new Date(currentMonth.value.getFullYear(), currentMonth.value.getMonth(), day)
  const dateString = date.toISOString().split('T')[0]
  return store.appointmentsByDate[dateString] || []
}

function formatTime(date: Date) {
  return date.toLocaleTimeString('nl-NL', { hour: '2-digit', minute: '2-digit' })
}

function formatDateTime(date: Date) {
  return date.toLocaleString('nl-NL', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

function openNewAppointment() {
  store.openModal()
}

function openNewAppointmentForDay(day: number) {
  const date = new Date(currentMonth.value.getFullYear(), currentMonth.value.getMonth(), day)
  const startTime = new Date(date)
  startTime.setHours(9, 0, 0, 0)
  const endTime = new Date(date)
  endTime.setHours(10, 0, 0, 0)

  store.openModal({
    title: '',
    start: startTime,
    end: endTime,
    type: 'meeting',
    description: '',
    color: '#3B82F6'
  })
}

function editAppointment(appointment: Appointment) {
  store.openModal(appointment)
}

function deleteAppointment(id: string) {
  if (confirm('Weet je zeker dat je deze afspraak wilt verwijderen?')) {
    store.deleteAppointment(id)
  }
}

function handleSaveAppointment(appointment: Omit<Appointment, 'id'>) {
  if (selectedAppointment.value) {
    store.updateAppointment(selectedAppointment.value.id, appointment)
  } else {
    store.addAppointment(appointment)
  }
  store.closeModal()
}

function closeModal() {
  store.closeModal()
}

function nextMonth() {
  store.nextMonth()
}

function previousMonth() {
  store.previousMonth()
}

function goToToday() {
  store.goToToday()
}
</script>

<style scoped>
.material-icons {
  font-family: 'Material Icons';
  font-weight: normal;
  font-style: normal;
  font-size: 24px;
  line-height: 1;
  letter-spacing: normal;
  text-transform: none;
  display: inline-block;
  white-space: nowrap;
  word-wrap: normal;
  direction: ltr;
}
</style> 