import { apiClient } from './api'

export interface Message {
  id: number
  sender_id: number
  receiver_id: number
  content: string
  is_read: boolean
  read_at: string | null
  created_at: string
  updated_at: string
  sender: {
    id: number
    name: string
    email: string
  }
}

export interface MessageCreate {
  receiver_id: number
  content: string
}

export interface UnreadCount {
  unread_count: number
}

export interface PaginatedResponse<T> {
  status: string
  data: {
    current_page: number
    data: T[]
    total: number
    per_page: number
  }
}

export const messagesService = {
  async getAll(): Promise<Message[]> {
    const response = await apiClient.get<PaginatedResponse<Message>>('/messages')
    return response.data.data.data
  },

  async create(message: MessageCreate): Promise<Message> {
    const response = await apiClient.post<{ status: string; data: Message }>('/messages', message)
    return response.data.data
  },

  async markAsRead(messageId: number): Promise<void> {
    await apiClient.post(`/messages/${messageId}/read`)
  },

  async getUnreadCount(): Promise<UnreadCount> {
    const response = await apiClient.get<UnreadCount>('/messages/unread-count')
    return response.data
  }
} 