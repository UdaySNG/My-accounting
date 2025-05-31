import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { appointmentsService, type ApiAppointment, type Appointment } from '../services/appointments'

export const useCalendarStore = defineStore('calendar', () => {
  // Initialize with first day of current month
  const today = new Date()
  const currentMonth = ref(new Date(today.getFullYear(), today.getMonth(), 1))
  
  const appointments = ref<Appointment[]>([])
  const selectedAppointment = ref<Appointment | Omit<Appointment, 'id'> | null>(null)
  const isModalOpen = ref(false)
  const isLoading = ref(false)
  const error = ref<string | null>(null)

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
      // Create a date object and set it to midnight UTC
      const date = new Date(appointment.start)
      const dateString = new Date(Date.UTC(
        date.getFullYear(),
        date.getMonth(),
        date.getDate()
      )).toISOString().split('T')[0]
      
      if (!result[dateString]) {
        result[dateString] = []
      }
      result[dateString].push(appointment)
    })
    return result
  })

  // Helper function to convert API appointment to store appointment
  function convertApiAppointment(apiAppointment: ApiAppointment): Appointment {
    // Handle both response formats (calendar view and create/update)
    const start = apiAppointment.start || apiAppointment.start_time
    const end = apiAppointment.end || apiAppointment.end_time
    
    // Validate required fields
    if (!apiAppointment.title) {
      console.error('Missing title in appointment:', apiAppointment)
      throw new Error('Title is required')
    }

    if (!start || !end) {
      console.error('Missing start/end time in appointment:', apiAppointment)
      throw new Error('Start and end times are required')
    }

    // Parse the UTC dates directly
    const startDate = new Date(start)
    const endDate = new Date(end)

    // Validate dates
    if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
      console.error('Invalid date format in appointment:', apiAppointment)
      throw new Error('Invalid date format')
    }

    return {
      id: apiAppointment.id?.toString() || 'new',
      title: apiAppointment.title,
      start: startDate,
      end: endDate,
      type: 'meeting' as const,
      description: apiAppointment.description || '',
      color: apiAppointment.color || '#3B82F6'
    }
  }

  // Helper function to convert store appointment to API appointment
  function convertToApiAppointment(appointment: Omit<Appointment, 'id'>) {
    if (!appointment.start || !appointment.end) {
      throw new Error('Start and end times are required')
    }

    return {
      title: appointment.title,
      description: appointment.description,
      start_time: appointment.start.toISOString(),
      end_time: appointment.end.toISOString(),
      location: '',
      status: 'scheduled' as const
    }
  }

  // Methods
  async function fetchAppointments() {
    isLoading.value = true
    error.value = null
    try {
      // Always start from today for upcoming appointments
      const today = new Date()
      const startDate = today.toISOString().split('T')[0]
      
      // Get end date for 6 months from now
      const futureDate = new Date(today.getFullYear(), today.getMonth() + 6, 0)
      const endDate = `${futureDate.getFullYear()}-${String(futureDate.getMonth() + 1).padStart(2, '0')}-${futureDate.getDate()}`

      // Also fetch appointments from the last day of the previous month
      const prevMonth = new Date(today.getFullYear(), today.getMonth() - 1, 1)
      const lastDayOfPrevMonth = new Date(prevMonth.getFullYear(), prevMonth.getMonth() + 1, 0)
      const prevMonthStartDate = lastDayOfPrevMonth.toISOString().split('T')[0]

      const apiAppointments = await appointmentsService.getCalendar(
        prevMonthStartDate,
        endDate
      )
      
      // Check if we have data in the response
      if (!apiAppointments) {
        appointments.value = []
        return
      }

      // Handle different response formats
      let appointmentsData
      if (Array.isArray(apiAppointments)) {
        appointmentsData = apiAppointments
      } else if (apiAppointments.data && Array.isArray(apiAppointments.data)) {
        appointmentsData = apiAppointments.data
      } else {
        appointments.value = []
        return
      }
      
      if (appointmentsData.length === 0) {
        appointments.value = []
        return
      }
      
      // Convert appointments
      appointments.value = appointmentsData.map((appointment: ApiAppointment) => {
        try {
          return convertApiAppointment(appointment)
        } catch (err) {
          console.error('Error converting appointment:', err)
          throw err
        }
      })
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Er is een fout opgetreden bij het ophalen van de afspraken.'
    } finally {
      isLoading.value = false
    }
  }

  async function addAppointment(appointment: Omit<Appointment, 'id'>) {
    try {
      const response = await appointmentsService.create(convertToApiAppointment(appointment))
      
      // Check if we have data in the response
      if (!response || !response.data) {
        throw new Error('Invalid response from server')
      }
      
      // Convert the appointment from the response data
      const newAppointment = convertApiAppointment(response.data)
      appointments.value.push(newAppointment)
    } catch (err) {
      error.value = 'Er is een fout opgetreden bij het aanmaken van de afspraak.'
      throw err
    }
  }

  async function updateAppointment(id: string, appointment: Omit<Appointment, 'id'>) {
    try {
      // Get the existing appointment to preserve any fields not included in the update
      const existingAppointment = appointments.value.find(a => a.id === id)
      if (!existingAppointment) {
        throw new Error('Appointment not found')
      }

      // Only include fields that are actually being changed
      const updateData: any = {
        status: 'scheduled' as const
      }

      // Only add fields to updateData if they are different from existing values
      if (appointment.title !== existingAppointment.title) {
        updateData.title = appointment.title
      }
      if (appointment.description !== existingAppointment.description) {
        updateData.description = appointment.description
      }

      // Only update times if they are explicitly changed
      if (appointment.start && 
          (appointment.start.getHours() !== existingAppointment.start.getHours() ||
           appointment.start.getMinutes() !== existingAppointment.start.getMinutes())) {
        // Convert local time to UTC for API
        const startUTC = new Date(Date.UTC(
          appointment.start.getFullYear(),
          appointment.start.getMonth(),
          appointment.start.getDate(),
          appointment.start.getHours(),
          appointment.start.getMinutes()
        ))
        updateData.start_time = startUTC.toISOString()
      }
      if (appointment.end && 
          (appointment.end.getHours() !== existingAppointment.end.getHours() ||
           appointment.end.getMinutes() !== existingAppointment.end.getMinutes())) {
        // Convert local time to UTC for API
        const endUTC = new Date(Date.UTC(
          appointment.end.getFullYear(),
          appointment.end.getMonth(),
          appointment.end.getDate(),
          appointment.end.getHours(),
          appointment.end.getMinutes()
        ))
        updateData.end_time = endUTC.toISOString()
      }

      console.log('Updating appointment with data:', updateData)
      const response = await appointmentsService.update(id, updateData)
      console.log('Update response:', response)

      // The response contains the appointment data directly
      if (!response || !response.id) {
        throw new Error('Invalid response format from server')
      }

      // Update the appointment in the local state
      const index = appointments.value.findIndex(a => a.id === id)
      if (index !== -1) {
        try {
          const updatedAppointment = convertApiAppointment(response)
          appointments.value[index] = updatedAppointment
        } catch (err) {
          console.error('Error converting updated appointment:', err)
          // If conversion fails, keep the existing appointment with updated fields
          appointments.value[index] = {
            ...existingAppointment,
            description: appointment.description || existingAppointment.description,
            title: appointment.title || existingAppointment.title
          }
        }
      }

      // Refresh appointments to ensure sync with server
      await fetchAppointments()
    } catch (err) {
      console.error('Error updating appointment:', err)
      error.value = 'Er is een fout opgetreden bij het bijwerken van de afspraak.'
      throw err
    }
  }

  async function deleteAppointment(id: string) {
    try {
      await appointmentsService.delete(id)
      // Remove the appointment from the local state
      appointments.value = appointments.value.filter(a => a.id !== id)
      // Refresh appointments to ensure sync with server
      await fetchAppointments()
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Er is een fout opgetreden bij het verwijderen van de afspraak.'
      throw err
    }
  }

  function openModal(appointment?: Appointment | Omit<Appointment, 'id'>) {
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
    fetchAppointments()
  }

  function previousMonth() {
    const newDate = new Date(currentMonth.value)
    newDate.setMonth(newDate.getMonth() - 1)
    currentMonth.value = newDate
    fetchAppointments()
  }

  function goToToday() {
    const today = new Date()
    currentMonth.value = new Date(today.getFullYear(), today.getMonth(), 1)
    fetchAppointments()
  }

  function setCurrentMonth(date: Date) {
    currentMonth.value = date
  }

  // Initial fetch
  fetchAppointments()

  return {
    appointments,
    selectedAppointment,
    isModalOpen,
    currentMonth,
    daysInMonth,
    firstDayOfMonth,
    appointmentsByDate,
    isLoading,
    error,
    addAppointment,
    updateAppointment,
    deleteAppointment,
    openModal,
    closeModal,
    nextMonth,
    previousMonth,
    goToToday,
    fetchAppointments,
    setCurrentMonth
  }
}) 