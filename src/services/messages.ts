import { apiClient } from './api'

export interface Message {
  id: number
  title: string
  content: string
  sender: string
  created_at: string
  read: boolean
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
  async getRecentMessages(): Promise<Message[]> {
    const response = await apiClient.get('/messages', {
      params: {
        limit: 5,
        sort: 'created_at',
        order: 'desc'
      }
    })
    return response.data.data.data
  },

  async markAsRead(messageId: number): Promise<void> {
    await apiClient.put(`/messages/${messageId}/read`)
  },

  async getAll(): Promise<Message[]> {
    const response = await apiClient.get<PaginatedResponse<Message>>('/messages')
    return response.data.data.data
  },

  async create(message: MessageCreate): Promise<Message> {
    const response = await apiClient.post<{ status: string; data: Message }>('/messages', message)
    return response.data.data
  },

  async getUnreadCount(): Promise<UnreadCount> {
    const response = await apiClient.get<UnreadCount>('/messages/unread-count')
    return response.data
  }
} 