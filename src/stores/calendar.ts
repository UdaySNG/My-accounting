import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export interface Appointment {
  id: string
  title: string
  start: Date
  end: Date
  type: 'meeting' | 'call' | 'other'
  description: string
  color: string
}

export const useCalendarStore = defineStore('calendar', () => {
  const appointments = ref<Appointment[]>([])
  const selectedAppointment = ref<Appointment | null>(null)
  const isModalOpen = ref(false)
  const currentMonth = ref(new Date())

  // Computed properties
  const daysInMonth = computed(() => {
    const year = currentMonth.value.getFullYear()
    const month = currentMonth.value.getMonth()
    return new Date(year, month + 1, 0).getDate()
  })

  const firstDayOfMonth = computed(() => {
    const year = currentMonth.value.getFullYear()
    const month = currentMonth.value.getMonth()
    const firstDay = new Date(year, month, 1).getDay()
    // Convert Sunday (0) to 7 for Monday-based week
    return firstDay === 0 ? 6 : firstDay - 1
  })

  const appointmentsByDate = computed(() => {
    const result: Record<string, Appointment[]> = {}
    appointments.value.forEach(appointment => {
      const dateString = appointment.start.toISOString().split('T')[0]
      if (!result[dateString]) {
        result[dateString] = []
      }
      result[dateString].push(appointment)
    })
    return result
  })

  // Methods
  function addAppointment(appointment: Omit<Appointment, 'id'>) {
    const newAppointment: Appointment = {
      ...appointment,
      id: crypto.randomUUID()
    }
    appointments.value.push(newAppointment)
  }

  function updateAppointment(id: string, appointment: Omit<Appointment, 'id'>) {
    const index = appointments.value.findIndex(a => a.id === id)
    if (index !== -1) {
      appointments.value[index] = { ...appointment, id }
    }
  }

  function deleteAppointment(id: string) {
    appointments.value = appointments.value.filter(a => a.id !== id)
  }

  function openModal(appointment?: Appointment) {
    selectedAppointment.value = appointment || null
    isModalOpen.value = true
  }

  function closeModal() {
    selectedAppointment.value = null
    isModalOpen.value = false
  }

  function nextMonth() {
    const newDate = new Date(currentMonth.value)
    newDate.setMonth(newDate.getMonth() + 1)
    currentMonth.value = newDate
  }

  function previousMonth() {
    const newDate = new Date(currentMonth.value)
    newDate.setMonth(newDate.getMonth() - 1)
    currentMonth.value = newDate
  }

  function goToToday() {
    currentMonth.value = new Date()
  }

  return {
    appointments,
    selectedAppointment,
    isModalOpen,
    currentMonth,
    daysInMonth,
    firstDayOfMonth,
    appointmentsByDate,
    addAppointment,
    updateAppointment,
    deleteAppointment,
    openModal,
    closeModal,
    nextMonth,
    previousMonth,
    goToToday
  }
}) 