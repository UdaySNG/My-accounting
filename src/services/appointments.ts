import axios from 'axios'
import { apiClient } from '@/services/api'

// API Response format
export interface ApiAppointment {
  id?: number
  title: string
  start?: string
  end?: string
  start_time?: string
  end_time?: string
  description?: string
  location?: string | null
  status?: string
  type?: string
  color?: string
}

// Frontend format
export interface Appointment {
  id: string
  title: string
  start: Date
  end: Date
  type: 'meeting' | 'call' | 'other'
  description: string
  color: string
}

// API Request formats
export interface AppointmentCreate {
  title: string
  description?: string
  start_time: string
  end_time: string
  location?: string
}

export interface AppointmentUpdate extends AppointmentCreate {
  status: 'scheduled' | 'completed' | 'cancelled'
}

export const appointmentsService = {
  async getAll(params?: { status?: string; start_date?: string; end_date?: string }) {
    const response = await apiClient.get('/appointments', { params })
    return response.data
  },

  async getById(id: string) {
    const response = await apiClient.get(`/appointments/${id}`)
    return response.data
  },

  async create(appointment: AppointmentCreate) {
    const response = await apiClient.post('/appointments', appointment)
    return response.data
  },

  async update(id: string, appointment: AppointmentUpdate) {
    const response = await apiClient.put(`/appointments/${id}`, appointment)
    return response.data
  },

  async delete(id: string) {
    try {
      const response = await apiClient.delete(`/appointments/${id}`)
      if (response.data && response.data.status === 'success') {
        return response.data
      } else {
        throw new Error(response.data?.message || 'Failed to delete appointment')
      }
    } catch (error: any) {
      console.error('Error deleting appointment:', error.response?.data?.message || error.message)
      throw error
    }
  },

  async getCalendar(startDate: string, endDate: string) {
    try {
      const formattedStartDate = new Date(startDate).toISOString().split('T')[0]
      const formattedEndDate = new Date(endDate).toISOString().split('T')[0]
      
      const response = await apiClient.get('/appointments/calendar', {
        params: { 
          start_date: formattedStartDate,
          end_date: formattedEndDate
        }
      })
      
      return response.data
    } catch (error: any) {
      console.error('Error fetching calendar:', error.response?.data?.message || error.message)
      throw error
    }
  }
} 