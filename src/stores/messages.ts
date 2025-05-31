import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { messagesService, type Message, type MessageCreate } from '../services/messages'
import { authService } from '../services/auth'

export const useMessagesStore = defineStore('messages', () => {
  const messages = ref<Message[]>([])
  const unreadCount = ref(0)
  const isLoading = ref(false)
  const error = ref<string | null>(null)
  const currentPage = ref(1)
  const totalPages = ref(1)
  const totalMessages = ref(0)
  const perPage = ref(20)

  // Computed properties
  const sortedMessages = computed(() => {
    if (!messages.value) return []
    return [...messages.value].sort((a, b) => 
      new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    )
  })

  // Methods
  async function fetchMessages(page = 1) {
    isLoading.value = true
    error.value = null
    try {
      const response = await messagesService.getAll()
      console.log('Fetched messages:', response)
      messages.value = response
      currentPage.value = page
      totalMessages.value = response.length
      perPage.value = response.length > 0 ? Math.ceil(response.length / page) : 20
      totalPages.value = Math.ceil(totalMessages.value / perPage.value)
    } catch (e) {
      error.value = e instanceof Error ? e.message : 'Er is een fout opgetreden bij het ophalen van de berichten'
      console.error('Error fetching messages:', e)
      messages.value = []
    } finally {
      isLoading.value = false
    }
  }

  async function sendMessage(message: MessageCreate) {
    isLoading.value = true
    error.value = null
    try {
      const newMessage = await messagesService.create(message)
      messages.value = [newMessage, ...(messages.value || [])]
      totalMessages.value++
      totalPages.value = Math.ceil(totalMessages.value / perPage.value)
    } catch (e) {
      error.value = e instanceof Error ? e.message : 'Er is een fout opgetreden bij het versturen van het bericht'
      console.error('Error sending message:', e)
      throw e
    } finally {
      isLoading.value = false
    }
  }

  async function markAsRead(messageId: number) {
    const message = messages.value?.find(m => m.id === messageId)
    console.log('Attempting to mark message as read:', { messageId, message })
    
    // Check if message exists
    if (!message) {
      error.value = 'Bericht niet gevonden'
      return
    }

    try {
      // Get current user from localStorage
      const userStr = localStorage.getItem('user')
      console.log('Current user from localStorage:', userStr)
      
      if (!userStr) {
        error.value = 'Je bent niet ingelogd'
        return
      }
      const user = JSON.parse(userStr)
      console.log('Parsed user data:', user)
      console.log('Message receiver_id:', message.receiver_id)
      console.log('Message sender_id:', message.sender_id)
      console.log('User id:', user.id)

      // Allow both sender and receiver to mark the message as read
      const isSender = message.sender_id === user.id
      const isReceiver = message.receiver_id === user.id

      if (!isSender && !isReceiver) {
        console.log('Permission denied: User is neither sender nor receiver')
        error.value = 'Je hebt geen rechten om dit bericht als gelezen te markeren'
        return
      }

      await messagesService.markAsRead(messageId)
      if (message) {
        message.is_read = true
        message.read_at = new Date().toISOString()
        unreadCount.value = Math.max(0, unreadCount.value - 1)
      }
    } catch (e) {
      const errorMessage = e instanceof Error ? e.message : 'Er is een fout opgetreden bij het markeren van het bericht als gelezen'
      error.value = errorMessage
      console.error('Error marking message as read:', e)
      // Don't throw the error, just show it to the user
    }
  }

  async function fetchUnreadCount() {
    try {
      const { unread_count } = await messagesService.getUnreadCount()
      unreadCount.value = unread_count
    } catch (e) {
      error.value = e instanceof Error ? e.message : 'Er is een fout opgetreden bij het ophalen van het aantal ongelezen berichten'
      console.error('Error fetching unread count:', e)
    }
  }

  return {
    messages,
    unreadCount,
    isLoading,
    error,
    currentPage,
    totalPages,
    totalMessages,
    perPage,
    sortedMessages,
    fetchMessages,
    sendMessage,
    markAsRead,
    fetchUnreadCount
  }
}) 