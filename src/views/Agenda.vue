<template>
  <div class="p-6">
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-2xl font-bold">Agenda</h1>
    </div>

    <!-- Calendar Navigation -->
    <div class="flex justify-between items-center mb-4">
      <div class="flex items-center space-x-4">
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
        <button 
          @click="goToToday"
          class="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
        >
          <span class="material-icons">today</span>
        </button>
      </div>
    </div>

    <!-- Calendar Grid -->
    <div class="bg-white dark:bg-gray-800 rounded-lg shadow mb-6">
      <!-- Loading State -->
      <div v-if="store.isLoading" class="p-4 text-center">
        <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
        <p class="mt-2 text-gray-600 dark:text-gray-300">Afspraken laden...</p>
      </div>

      <!-- Error State -->
      <div v-else-if="store.error" class="p-4 text-center">
        <span class="material-icons text-red-500 text-4xl">error</span>
        <p class="mt-2 text-red-500">{{ store.error }}</p>
        <button 
          @click="store.fetchAppointments"
          class="mt-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
        >
          Probeer opnieuw
        </button>
      </div>

      <!-- Calendar Content -->
      <template v-else>
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
            :data-day="day"
            class="calendar-day min-h-[120px] bg-white dark:bg-gray-800 p-2 relative cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700"
            :class="{
              'ring-2 ring-blue-500': isSelectedDate(day),
              'bg-blue-50 dark:bg-blue-900/20': isSelectedDate(day)
            }"
            @mousedown="handleDragStart($event, day)"
          >
            <span 
              class="text-sm font-medium"
              :class="{
                'text-gray-400': !isCurrentMonth,
                'text-gray-600 dark:text-gray-400': isCurrentMonth,
                'text-blue-600 dark:text-blue-400 font-bold': isSelectedDate(day)
              }"
            >
              {{ day }}
            </span>
            
            <!-- Appointments for this day -->
            <div 
              v-for="appointment in getAppointmentsForDay(day)"
              :key="appointment.id"
              class="mt-1 cursor-pointer"
              @click="editAppointment(appointment)"
              @contextmenu.prevent="handleAppointmentContextMenu($event, appointment)"
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
      </template>
    </div>

    <!-- Appointments Section -->
    <div class="mt-8">
      <h3 class="text-lg font-semibold mb-4">Afspraken</h3>
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <!-- Past Appointments -->
        <div>
          <h4 class="text-md font-medium text-gray-600 dark:text-gray-300 mb-4">Afgelopen Afspraken</h4>
          <div class="space-y-4">
            <template v-for="item in pastAppointments" :key="item.isMonthHeader ? item.month : item.id">
              <!-- Month Header -->
              <div v-if="item.isMonthHeader" class="mt-4 first:mt-0">
                <h5 class="text-sm font-medium text-gray-500 dark:text-gray-400">{{ item.month }}</h5>
              </div>
              
              <!-- Appointment Card -->
              <div 
                v-else
                class="bg-white dark:bg-gray-800 p-4 rounded-lg shadow cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 opacity-75"
                @click="navigateToAppointment(item)"
              >
                <div class="flex items-center justify-between">
                  <div>
                    <h4 class="font-medium text-gray-600 dark:text-gray-300">{{ item.title }}</h4>
                    <p class="text-sm text-gray-500 dark:text-gray-400">
                      {{ formatDateTime(item.start) }}
                    </p>
                    <p class="text-sm text-gray-400 dark:text-gray-500">
                      {{ item.type === 'meeting' ? 'Meeting' : 
                         item.type === 'call' ? 'Telefoongesprek' : 'Anders' }}
                    </p>
                  </div>
                  <div class="flex space-x-2">
                    <button 
                      @click.stop="editAppointment(item)"
                      class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
                    >
                      <span class="material-icons">edit</span>
                    </button>
                    <button 
                      @click.stop="deleteAppointment(item.id)"
                      class="text-gray-400 hover:text-red-500"
                    >
                      <span class="material-icons">delete</span>
                    </button>
                  </div>
                </div>
              </div>
            </template>
          </div>
        </div>

        <!-- Future Appointments -->
        <div>
          <h4 class="text-md font-medium text-gray-600 dark:text-gray-300 mb-4">Aankomende Afspraken</h4>
          <div class="space-y-4">
            <template v-for="item in upcomingAppointments" :key="item.isMonthHeader ? item.month : item.id">
              <!-- Month Header -->
              <div v-if="item.isMonthHeader" class="mt-4 first:mt-0">
                <h5 class="text-sm font-medium text-gray-500 dark:text-gray-400">{{ item.month }}</h5>
              </div>
              
              <!-- Appointment Card -->
              <div 
                v-else
                class="bg-white dark:bg-gray-800 p-4 rounded-lg shadow cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700"
                @click="navigateToAppointment(item)"
              >
                <div class="flex items-center justify-between">
                  <div>
                    <h4 class="font-medium">{{ item.title }}</h4>
                    <p class="text-sm text-gray-600 dark:text-gray-300">
                      {{ formatDateTime(item.start) }}
                    </p>
                    <p class="text-sm text-gray-500 dark:text-gray-400">
                      {{ item.type === 'meeting' ? 'Meeting' : 
                         item.type === 'call' ? 'Telefoongesprek' : 'Anders' }}
                    </p>
                  </div>
                  <div class="flex space-x-2">
                    <button 
                      @click.stop="editAppointment(item)"
                      class="text-blue-500 hover:text-blue-600"
                    >
                      <span class="material-icons">edit</span>
                    </button>
                    <button 
                      @click.stop="deleteAppointment(item.id)"
                      class="text-red-500 hover:text-red-600"
                    >
                      <span class="material-icons">delete</span>
                    </button>
                  </div>
                </div>
              </div>
            </template>
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

    <!-- Context Menu -->
    <div v-if="showContextMenu" 
         class="context-menu" 
         :style="{ top: contextMenuPosition.y + 'px', left: contextMenuPosition.x + 'px' }">
      <button @click="handleEdit" class="context-menu-item">
        <i class="fas fa-edit"></i> Bewerken
      </button>
      <button @click="handleDuplicate" class="context-menu-item">
        <i class="fas fa-copy"></i> Dupliceren
      </button>
      <button @click="handleDelete" class="context-menu-item text-red-500">
        <i class="fas fa-trash"></i> Verwijderen
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, onMounted, onUnmounted } from 'vue'
import { useCalendarStore } from '../stores/calendar'
import type { Appointment } from '../services/appointments'
import AppointmentModal from '../components/AppointmentModal.vue'

const store = useCalendarStore()
const selectedDate = ref<Date>(new Date()) // Initialize with today's date

// Add these helper functions at the top of the script
function getFirstDayOfMonth(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), 1)
}

function getLastDayOfMonth(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth() + 1, 0)
}

// Update the computed properties
const currentMonth = computed(() => store.currentMonth)
const daysInMonth = computed(() => {
  const lastDay = new Date(store.currentMonth.getFullYear(), store.currentMonth.getMonth() + 1, 0)
  return lastDay.getDate()
})
const firstDayOfMonth = computed(() => {
  const firstDay = new Date(store.currentMonth.getFullYear(), store.currentMonth.getMonth(), 1)
  const day = firstDay.getDay()
  return day === 0 ? 6 : day - 1 // Convert to Monday-based week (0-6)
})

const isModalOpen = computed(() => store.isModalOpen)
const selectedAppointment = computed(() => store.selectedAppointment)
const isCurrentMonth = computed(() => {
  const today = new Date()
  return currentMonth.value.getMonth() === today.getMonth() && 
         currentMonth.value.getFullYear() === today.getFullYear()
})

const upcomingAppointments = computed(() => {
  const now = new Date()
  // Get all future appointments, regardless of calendar view
  const futureAppointments = store.appointments
    .filter(a => a.start >= now)
    .sort((a, b) => a.start.getTime() - b.start.getTime())
  
  // Group appointments by month
  const appointmentsByMonth = futureAppointments.reduce((acc, appointment) => {
    const month = appointment.start.toLocaleString('nl-NL', { month: 'long', year: 'numeric' })
    if (!acc[month]) {
      acc[month] = []
    }
    acc[month].push(appointment)
    return acc
  }, {} as Record<string, Appointment[]>)

  // Flatten the groups back into an array
  return Object.entries(appointmentsByMonth)
    .flatMap(([month, appointments]) => [
      { isMonthHeader: true, month } as any,
      ...appointments
    ])
})

const pastAppointments = computed(() => {
  const now = new Date()
  // Get all past appointments, regardless of calendar view
  const pastAppointments = store.appointments
    .filter(a => a.start < now)
    .sort((a, b) => b.start.getTime() - a.start.getTime()) // Sort in reverse chronological order
  
  // Group appointments by month
  const appointmentsByMonth = pastAppointments.reduce((acc, appointment) => {
    const month = appointment.start.toLocaleString('nl-NL', { month: 'long', year: 'numeric' })
    if (!acc[month]) {
      acc[month] = []
    }
    acc[month].push(appointment)
    return acc
  }, {} as Record<string, Appointment[]>)

  // Flatten the groups back into an array
  return Object.entries(appointmentsByMonth)
    .flatMap(([month, appointments]) => [
      { isMonthHeader: true, month } as any,
      ...appointments
    ])
})

// Context menu state
const showContextMenu = ref(false)
const contextMenuPosition = ref({ x: 0, y: 0 })
const contextMenuAppointment = ref<Appointment | null>(null)

// Drag selection state
const isDragging = ref(false)
const dragStartDate = ref<Date | null>(null)
const dragEndDate = ref<Date | null>(null)
const dragStartCell = ref<HTMLElement | null>(null)
const isRangeSelected = ref(false)

// Add these computed properties and refs
const selectedCalendarMonth = ref(new Date().toISOString().slice(0, 7)) // Format: YYYY-MM

const availableMonths = computed(() => {
  const months = []
  const now = new Date()
  const currentYear = now.getFullYear()
  
  // Add past 6 months
  for (let i = 6; i > 0; i--) {
    const date = new Date(currentYear, now.getMonth() - i, 1)
    months.push({
      value: date.toISOString().slice(0, 7),
      label: date.toLocaleString('nl-NL', { month: 'long', year: 'numeric' })
    })
  }
  
  // Add current month
  months.push({
    value: now.toISOString().slice(0, 7),
    label: now.toLocaleString('nl-NL', { month: 'long', year: 'numeric' })
  })
  
  // Add next 6 months
  for (let i = 1; i <= 6; i++) {
    const date = new Date(currentYear, now.getMonth() + i, 1)
    months.push({
      value: date.toISOString().slice(0, 7),
      label: date.toLocaleString('nl-NL', { month: 'long', year: 'numeric' })
    })
  }
  
  return months
})

// Methods
function navigateToAppointment(appointment: Appointment) {
  // Set the current month to the appointment's month
  const appointmentDate = new Date(appointment.start)
  store.setCurrentMonth(new Date(appointmentDate.getFullYear(), appointmentDate.getMonth(), 1))
  
  // Set the selected date to the exact appointment date
  selectedDate.value = appointmentDate
  
  // Fetch appointments for the new month
  store.fetchAppointments()
}

function getAppointmentsForDay(day: number) {
  // Create a date object for the current day at midnight UTC
  const date = new Date(Date.UTC(
    store.currentMonth.getFullYear(),
    store.currentMonth.getMonth(),
    day
  ))
  const dateString = date.toISOString().split('T')[0]
  
  // Get appointments for this day
  const dayAppointments = store.appointmentsByDate[dateString] || []
  
  // Also check if there are any appointments from the previous month that might overlap
  if (day === 1) {
    const prevMonth = new Date(Date.UTC(
      store.currentMonth.getFullYear(),
      store.currentMonth.getMonth() - 1,
      1
    ))
    const lastDayOfPrevMonth = new Date(Date.UTC(
      prevMonth.getFullYear(),
      prevMonth.getMonth() + 1,
      0
    ))
    const prevMonthDateString = lastDayOfPrevMonth.toISOString().split('T')[0]
    const prevMonthAppointments = store.appointmentsByDate[prevMonthDateString] || []
    
    // Filter appointments to only include those that actually belong to the current day
    const filteredPrevMonthAppointments = prevMonthAppointments.filter(appointment => {
      const appointmentDate = new Date(appointment.start)
      return appointmentDate.getUTCDate() === day && 
             appointmentDate.getUTCMonth() === date.getUTCMonth() &&
             appointmentDate.getUTCFullYear() === date.getUTCFullYear()
    })
    
    return [...dayAppointments, ...filteredPrevMonthAppointments]
  }
  
  return dayAppointments
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
  } as Omit<Appointment, 'id'>)
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
  if (selectedAppointment.value && 'id' in selectedAppointment.value) {
    // Update existing appointment
    store.updateAppointment(selectedAppointment.value.id, appointment)
  } else {
    // Create new appointment
    store.addAppointment(appointment)
  }
  closeModal()
  cleanupDragSelection() // Clear the selection after saving
}

function closeModal() {
  store.closeModal()
  cleanupDragSelection() // Clear the selection when canceling
}

function nextMonth() {
  const newDate = new Date(store.currentMonth.getFullYear(), store.currentMonth.getMonth() + 1, 1)
  store.setCurrentMonth(newDate)
  store.fetchAppointments()
}

function previousMonth() {
  const newDate = new Date(store.currentMonth.getFullYear(), store.currentMonth.getMonth() - 1, 1)
  store.setCurrentMonth(newDate)
  store.fetchAppointments()
}

function goToToday() {
  const today = new Date()
  const newDate = new Date(today.getFullYear(), today.getMonth(), 1)
  store.setCurrentMonth(newDate)
  selectedDate.value = today // Set selected date to today
  store.fetchAppointments()
}

function isSelectedDate(day: number): boolean {
  if (!selectedDate.value) return false
  
  const date = new Date(store.currentMonth.getFullYear(), store.currentMonth.getMonth(), day)
  return date.toDateString() === selectedDate.value.toDateString()
}

// Handle right click on appointment
function handleAppointmentContextMenu(event: MouseEvent, appointment: Appointment) {
  event.preventDefault()
  contextMenuPosition.value = {
    x: event.clientX,
    y: event.clientY
  }
  contextMenuAppointment.value = appointment
  showContextMenu.value = true
}

// Close context menu when clicking outside
function handleClickOutside(event: MouseEvent) {
  if (showContextMenu.value) {
    const contextMenu = document.querySelector('.context-menu')
    if (contextMenu && !contextMenu.contains(event.target as Node)) {
      showContextMenu.value = false
    }
  }
}

// Context menu actions
function handleEdit() {
  if (contextMenuAppointment.value) {
    store.openModal(contextMenuAppointment.value)
    showContextMenu.value = false
  }
}

function handleDuplicate() {
  if (contextMenuAppointment.value && 'id' in contextMenuAppointment.value) {
    const { id, ...appointmentWithoutId } = contextMenuAppointment.value
    const duplicatedAppointment = {
      ...appointmentWithoutId,
      title: `${appointmentWithoutId.title} (kopie)`,
      start: new Date(appointmentWithoutId.start),
      end: new Date(appointmentWithoutId.end)
    }
    store.openModal(duplicatedAppointment)
    showContextMenu.value = false
  }
}

async function handleDelete() {
  if (contextMenuAppointment.value && 'id' in contextMenuAppointment.value) {
    if (confirm('Weet je zeker dat je deze afspraak wilt verwijderen?')) {
      try {
        await store.deleteAppointment(contextMenuAppointment.value.id)
        showContextMenu.value = false
      } catch (error) {
        console.error('Error deleting appointment:', error)
      }
    }
  }
}

// Methods for drag selection
function handleDragStart(event: MouseEvent, day: number) {
  if (event.button !== 0) return // Only left mouse button
  
  isDragging.value = true
  const date = new Date(currentMonth.value.getFullYear(), currentMonth.value.getMonth(), day)
  dragStartDate.value = date
  dragEndDate.value = date
  dragStartCell.value = event.currentTarget as HTMLElement
  
  // Add drag classes
  dragStartCell.value.classList.add('bg-blue-100', 'dark:bg-blue-900/30')
  
  // Add event listeners for drag
  document.addEventListener('mousemove', handleDragMove)
  document.addEventListener('mouseup', handleDragEnd)
}

function handleDragMove(event: MouseEvent) {
  if (!isDragging.value) return
  
  // Find the cell under the mouse
  const cell = document.elementFromPoint(event.clientX, event.clientY)
  if (!cell) return
  
  // Find the day number from the cell
  const dayElement = cell.closest('[data-day]')
  if (!dayElement) return
  
  const day = parseInt(dayElement.getAttribute('data-day') || '0')
  if (isNaN(day)) return
  
  const date = new Date(currentMonth.value.getFullYear(), currentMonth.value.getMonth(), day)
  dragEndDate.value = date
  
  // Update visual selection
  updateDragSelection()
}

function handleDragEnd() {
  if (!isDragging.value || !dragStartDate.value || !dragEndDate.value) return
  
  // Create new appointment with the selected date range
  const startDate = new Date(Math.min(dragStartDate.value.getTime(), dragEndDate.value.getTime()))
  const endDate = new Date(Math.max(dragStartDate.value.getTime(), dragEndDate.value.getTime()))
  
  // Set default times (9:00 - 10:00)
  startDate.setHours(9, 0, 0, 0)
  endDate.setHours(10, 0, 0, 0)
  
  // Mark range as selected
  isRangeSelected.value = true
  
  // Open modal with the selected date range
  store.openModal({
    title: '',
    start: startDate,
    end: endDate,
    type: 'meeting',
    description: '',
    color: '#3B82F6'
  } as Omit<Appointment, 'id'>)
  
  // Clean up drag state but keep selection
  cleanupDragState()
}

function updateDragSelection() {
  if (!dragStartDate.value || !dragEndDate.value) return
  
  // Remove selection from all cells
  document.querySelectorAll('.calendar-day').forEach(cell => {
    cell.classList.remove('bg-blue-100', 'dark:bg-blue-900/30')
  })
  
  // Add selection to cells in range
  const start = Math.min(dragStartDate.value.getDate(), dragEndDate.value.getDate())
  const end = Math.max(dragStartDate.value.getDate(), dragEndDate.value.getDate())
  
  for (let day = start; day <= end; day++) {
    const cell = document.querySelector(`[data-day="${day}"]`)
    if (cell) {
      cell.classList.add('bg-blue-100', 'dark:bg-blue-900/30')
    }
  }
}

function cleanupDragState() {
  isDragging.value = false
  dragStartCell.value = null
  
  // Remove event listeners
  document.removeEventListener('mousemove', handleDragMove)
  document.removeEventListener('mouseup', handleDragEnd)
}

function cleanupDragSelection() {
  isRangeSelected.value = false
  dragStartDate.value = null
  dragEndDate.value = null
  
  // Remove selection from all cells
  document.querySelectorAll('.calendar-day').forEach(cell => {
    cell.classList.remove('bg-blue-100', 'dark:bg-blue-900/30')
  })
}

// Add click outside listener
onMounted(() => {
  document.addEventListener('click', handleClickOutside)
  // Set today's date when component mounts
  selectedDate.value = new Date()
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})

// Update the methods
function handleMonthChange() {
  const [year, month] = selectedCalendarMonth.value.split('-').map(Number)
  const newDate = getFirstDayOfMonth(new Date(year, month - 1, 1))
  store.setCurrentMonth(newDate)
  store.fetchAppointments()
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

.context-menu {
  position: fixed;
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 0.375rem;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
  z-index: 50;
  min-width: 150px;
}

.context-menu-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  width: 100%;
  padding: 0.5rem 1rem;
  text-align: left;
  border: none;
  background: none;
  cursor: pointer;
  color: #374151;
  font-size: 0.875rem;
}

.context-menu-item:hover {
  background-color: #f3f4f6;
}

.context-menu-item i {
  width: 1rem;
  text-align: center;
}

.text-red-500 {
  color: #ef4444;
}

.text-red-500:hover {
  background-color: #fee2e2;
}

.calendar-day {
  user-select: none;
  transition: background-color 0.2s;
}

.calendar-day.bg-blue-100 {
  background-color: rgba(219, 234, 254, 0.5);
}

.dark .calendar-day.bg-blue-900\/30 {
  background-color: rgba(30, 58, 138, 0.3);
}
</style> 