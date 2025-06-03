<template>
  <div class="p-6">
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-2xl font-bold text-gray-900 dark:text-white">Berichten</h1>
      <div class="flex space-x-2">
        <button 
          @click="showNewMessageModal = true"
          class="px-4 py-2 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors flex items-center"
        >
          <span class="material-icons text-lg mr-2">add</span>
          Nieuw bericht
        </button>
        <button class="px-4 py-2 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors flex items-center">
          <span class="material-icons text-lg mr-2">filter_list</span>
          Filter
        </button>
        <button class="px-4 py-2 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors flex items-center">
          <span class="material-icons text-lg mr-2">search</span>
          Zoeken
        </button>
      </div>
    </div>

    <div class="bg-white dark:bg-gray-800 rounded-lg shadow">
      <!-- Message Categories -->
      <div class="border-b border-gray-200 dark:border-gray-700">
        <div class="flex space-x-4 px-6 py-4">
          <button
            v-for="category in categories"
            :key="category.id"
            @click="activeCategory = category.id"
            class="relative px-4 py-2 rounded-lg transition-colors"
            :class="activeCategory === category.id ? 'text-slack-purple' : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'"
          >
            {{ category.name }}
            <span 
              v-if="category.unreadCount > 0"
              class="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center"
            >
              {{ category.unreadCount }}
            </span>
          </button>
        </div>
      </div>

      <!-- Messages List -->
      <div class="divide-y divide-gray-200 dark:divide-gray-700">
        <!-- Loading State -->
        <div v-if="store.isLoading" class="p-12 text-center">
          <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          <p class="mt-4 text-gray-500 dark:text-gray-400">Berichten laden...</p>
        </div>

        <!-- Error State -->
        <div v-else-if="store.error" class="p-12 text-center">
          <span class="material-icons text-red-500 text-5xl mb-4">error_outline</span>
          <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-1">Er is een fout opgetreden</h3>
          <p class="text-gray-500 dark:text-gray-400">{{ store.error }}</p>
          <button 
            @click="store.fetchMessages()"
            class="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
          >
            Probeer opnieuw
          </button>
        </div>

        <!-- Messages -->
        <template v-else>
          <div 
            v-for="message in filteredMessages" 
            :key="message.id"
            class="p-6 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors cursor-pointer"
            :class="{ 'bg-purple-50 dark:bg-purple-900/20': !message.is_read }"
            @click="markAsRead(message.id)"
          >
            <div class="flex items-start justify-between">
              <div class="flex items-start space-x-4">
                <!-- Icon based on message type -->
                <div class="flex-shrink-0 w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center">
                  <span class="material-icons text-gray-600 dark:text-gray-300">{{ getIconFromCategory(getCategoryFromSender(message.sender.name)) }}</span>
                </div>
                
                <div class="flex-1 min-w-0">
                  <div class="flex items-center justify-between">
                    <h3 class="text-sm font-medium text-gray-900 dark:text-white">{{ message.subject }}</h3>
                    <span class="text-xs text-gray-500 dark:text-gray-400">{{ formatTime(message.created_at) }}</span>
                  </div>
                  <p class="mt-1 text-sm text-gray-600 dark:text-gray-300">{{ message.content }}</p>
                  <div class="mt-2 flex items-center space-x-4">
                    <span class="text-xs text-gray-500 dark:text-gray-400">{{ getCategoryFromSender(message.sender.name) }}</span>
                    <span v-if="!message.is_read" class="text-xs px-2 py-1 rounded-full bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300">
                      Ongelezen
                    </span>
                  </div>
                </div>
              </div>
              
              <button
                class="ml-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                @click.stop="deleteMessage(message.id)"
              >
                <span class="material-icons">delete_outline</span>
              </button>
            </div>
          </div>
        </template>
      </div>

      <!-- Empty State -->
      <div v-if="filteredMessages.length === 0" class="p-12 text-center">
        <span class="material-icons text-gray-400 dark:text-gray-600 text-5xl mb-4">inbox</span>
        <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-1">Geen berichten</h3>
        <p class="text-gray-500 dark:text-gray-400">Je hebt momenteel geen berichten in deze categorie.</p>
      </div>
    </div>

    <!-- New Message Modal -->
    <NewMessageModal
      :is-open="showNewMessageModal"
      @close="showNewMessageModal = false"
      @sent="handleMessageSent"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useMessagesStore } from '../stores/messages'
import NewMessageModal from '../components/NewMessageModal.vue'
import type { Message } from '../services/messages'

const store = useMessagesStore()
const showNewMessageModal = ref(false)
const activeCategory = ref('all')

const categories = ref([
  { id: 'all', name: 'Alle berichten', unreadCount: 0 },
  { id: 'system', name: 'Systeem', unreadCount: 0 },
  { id: 'accountant', name: 'Boekhouder', unreadCount: 0 },
  { id: 'invoices', name: 'Facturen', unreadCount: 0 }
])

const filteredMessages = computed(() => {
  const messages = store.sortedMessages
  if (activeCategory.value === 'all') return messages
  return messages.filter(msg => getCategoryFromSender(msg.sender.name).toLowerCase() === activeCategory.value)
})

function getCategoryFromSender(senderName: string): string {
  const name = senderName.toLowerCase()
  if (name.includes('systeem')) return 'Systeem'
  if (name.includes('boekhouder')) return 'Boekhouder'
  if (name.includes('factuur')) return 'Facturen'
  return 'Overig'
}

function getIconFromCategory(category: string): string {
  switch (category.toLowerCase()) {
    case 'systeem': return 'analytics'
    case 'boekhouder': return 'account_balance'
    case 'facturen': return 'receipt_long'
    default: return 'message'
  }
}

function formatTime(dateString: string) {
  const date = new Date(dateString)
  const now = new Date()
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000)
  
  if (diffInSeconds < 60) return 'net nu'
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} minuten geleden`
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} uur geleden`
  if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)} dagen geleden`
  
  return date.toLocaleDateString('nl-NL', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  })
}

async function markAsRead(messageId: number) {
  await store.markAsRead(messageId)
  await store.fetchUnreadCount()
  updateCategoryCounts()
}

async function deleteMessage(messageId: number) {
  // TODO: Implement delete functionality
  console.log('Delete message:', messageId)
}

function updateCategoryCounts() {
  const unreadCount = store.unreadCount
  categories.value = categories.value.map(category => ({
    ...category,
    unreadCount: category.id === 'all' ? unreadCount : 
      store.sortedMessages.filter(msg => 
        !msg.is_read && getCategoryFromSender(msg.sender.name).toLowerCase() === category.id
      ).length
  }))
}

async function handleMessageSent() {
  await store.fetchMessages()
  await store.fetchUnreadCount()
  updateCategoryCounts()
  showNewMessageModal.value = false
}

onMounted(async () => {
  await store.fetchMessages()
  await store.fetchUnreadCount()
  updateCategoryCounts()
})
</script>

<style scoped>
.material-icons {
  font-size: 20px;
}
</style> 