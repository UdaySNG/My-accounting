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
  id: number
  title: string
  description: string
  start: Date
  end: Date
  start_time: string
  end_time: string
  location?: string
  type: 'meeting' | 'call' | 'other'
  status: 'scheduled' | 'completed' | 'cancelled'
  color?: string
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
      
      console.log('Fetching calendar data:', {
        startDate: formattedStartDate,
        endDate: formattedEndDate,
        url: '/appointments/calendar-view',
        fullUrl: `${apiClient.defaults.baseURL}/appointments/calendar-view`
      });

      // Try the calendar endpoint first
      try {
        const response = await apiClient.get('/appointments/calendar-view', {
          params: { 
            start_date: formattedStartDate,
            end_date: formattedEndDate
          }
        })
        
        console.log('Calendar API Response:', response.data);
        return { 
          data: response.data.data || response.data,
          error: null
        };
      } catch (calendarError: any) {
        // If calendar endpoint fails with 404, fall back to regular appointments endpoint
        if (calendarError.response?.status === 404) {
          console.log('Calendar endpoint not available, falling back to regular appointments endpoint');
          const fallbackResponse = await apiClient.get('/appointments', {
            params: {
              start_date: formattedStartDate,
              end_date: formattedEndDate
            }
          });
          
          console.log('Fallback response:', fallbackResponse.data);
          
          // Handle paginated response
          const appointments = fallbackResponse.data.data?.data || fallbackResponse.data.data || [];
          
          // Transform the appointments to calendar format
          const formattedAppointments = appointments.map((appointment: any) => ({
            id: appointment.id,
            title: appointment.title,
            description: appointment.description || '',
            start: new Date(appointment.start_time),
            end: new Date(appointment.end_time),
            start_time: appointment.start_time,
            end_time: appointment.end_time,
            location: appointment.location || '',
            type: 'meeting',
            status: appointment.status || 'scheduled',
            color: '#3B82F6'
          }));

          console.log('Formatted appointments:', formattedAppointments);

          return { 
            data: formattedAppointments,
            error: null
          };
        }
        throw calendarError; // Re-throw if it's not a 404 error
      }
    } catch (error: any) {
      console.error('Error fetching calendar:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
        headers: error.response?.headers,
        url: error.config?.url,
        params: error.config?.params,
        baseURL: apiClient.defaults.baseURL
      });
      
      // Return empty array with error message
      return { 
        data: [],
        error: error.response?.data?.message || 'Failed to fetch appointments'
      };
    }
  },

  async getUpcomingAppointments(): Promise<Appointment[]> {
    const today = new Date()
    const endDate = new Date()
    endDate.setMonth(endDate.getMonth() + 1) // Get appointments for the next month
    
    try {
      const response = await apiClient.get('/appointments/calendar-view', {
        params: {
          start_date: today.toISOString().split('T')[0],
          end_date: endDate.toISOString().split('T')[0]
        }
      })
      
      console.log('Calendar API Response:', response.data)
      
      // Handle both possible response formats
      const appointments = response.data.data || response.data
      
      // Ensure we have an array and convert the dates
      const formattedAppointments = (Array.isArray(appointments) ? appointments : []).map((appointment: ApiAppointment) => ({
        id: appointment.id || 0,
        title: appointment.title,
        description: appointment.description || '',
        start: new Date(appointment.start_time || appointment.start || ''),
        end: new Date(appointment.end_time || appointment.end || ''),
        start_time: appointment.start_time || appointment.start || '',
        end_time: appointment.end_time || appointment.end || '',
        location: appointment.location || '',
        type: (appointment.type || 'meeting') as 'meeting' | 'call' | 'other',
        status: (appointment.status || 'scheduled') as 'scheduled' | 'completed' | 'cancelled',
        color: appointment.color || '#3B82F6'
      }))
      
      console.log('Formatted appointments:', formattedAppointments)
      return formattedAppointments
    } catch (error) {
      console.error('Error fetching upcoming appointments:', error)
      return []
    }
  },

  async createAppointment(appointment: Omit<Appointment, 'id'>): Promise<Appointment> {
    try {
      console.log('Creating appointment:', appointment);
      
      // Convert the appointment to the API format
      const apiAppointment = {
        title: appointment.title,
        description: appointment.description,
        start_time: appointment.start.toISOString(),
        end_time: appointment.end.toISOString(),
        location: appointment.location || '',
        type: appointment.type || 'meeting',
        status: 'scheduled'
      };

      console.log('Sending to API:', apiAppointment);
      
      const response = await apiClient.post('/appointments', apiAppointment);
      console.log('Create appointment response:', response.data);

      if (!response.data || !response.data.data) {
        throw new Error('Invalid response from server');
      }

      // Convert the response back to our frontend format
      const createdAppointment = {
        id: response.data.data.id,
        title: response.data.data.title,
        description: response.data.data.description,
        start: new Date(response.data.data.start_time),
        end: new Date(response.data.data.end_time),
        start_time: response.data.data.start_time,
        end_time: response.data.data.end_time,
        location: response.data.data.location,
        type: response.data.data.type,
        status: response.data.data.status,
        color: response.data.data.color || '#3B82F6'
      };

      console.log('Created appointment:', createdAppointment);
      return createdAppointment;
    } catch (error: any) {
      console.error('Error creating appointment:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status
      });
      throw error;
    }
  },

  async updateAppointment(id: number, appointment: Partial<Appointment>): Promise<Appointment> {
    const response = await apiClient.put(`/appointments/${id}`, appointment)
    return response.data.data
  },

  async deleteAppointment(id: number): Promise<void> {
    await apiClient.delete(`/appointments/${id}`)
  }
} 