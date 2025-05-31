<template>
  <div class="p-6">
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-2xl font-bold text-gray-900 dark:text-white">Berichten</h1>
      <div class="flex space-x-2">
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
              v-if="category.count > 0"
              class="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center"
            >
              {{ category.count }}
            </span>
          </button>
        </div>
      </div>

      <!-- Messages List -->
      <div class="divide-y divide-gray-200 dark:divide-gray-700">
        <div 
          v-for="message in filteredMessages" 
          :key="message.id"
          class="p-6 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors cursor-pointer"
          :class="{ 'bg-purple-50 dark:bg-purple-900/20': !message.read }"
          @click="markAsRead(message.id)"
        >
          <div class="flex items-start justify-between">
            <div class="flex items-start space-x-4">
              <!-- Icon based on message type -->
              <div class="flex-shrink-0 w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center">
                <span class="material-icons text-gray-600 dark:text-gray-300">{{ message.icon }}</span>
              </div>
              
              <div class="flex-1 min-w-0">
                <div class="flex items-center justify-between">
                  <h3 class="text-sm font-medium text-gray-900 dark:text-white">{{ message.title }}</h3>
                  <span class="text-xs text-gray-500 dark:text-gray-400">{{ message.time }}</span>
                </div>
                <p class="mt-1 text-sm text-gray-600 dark:text-gray-300">{{ message.content }}</p>
                <div class="mt-2 flex items-center space-x-4">
                  <span class="text-xs text-gray-500 dark:text-gray-400">{{ message.category }}</span>
                  <span v-if="message.priority === 'high'" class="text-xs px-2 py-1 rounded-full bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300">
                    Hoog
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
      </div>

      <!-- Empty State -->
      <div v-if="filteredMessages.length === 0" class="p-12 text-center">
        <span class="material-icons text-gray-400 dark:text-gray-600 text-5xl mb-4">inbox</span>
        <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-1">Geen berichten</h3>
        <p class="text-gray-500 dark:text-gray-400">Je hebt momenteel geen berichten in deze categorie.</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

const activeCategory = ref('all')

const categories = [
  { id: 'all', name: 'Alle berichten', count: 0 },
  { id: 'system', name: 'Systeem', count: 2 },
  { id: 'accountant', name: 'Boekhouder', count: 1 },
  { id: 'invoices', name: 'Facturen', count: 3 }
]

const messages = ref([
  {
    id: 1,
    title: 'Boekhouder',
    content: 'Uw jaarrekening is goedgekeurd. U kunt deze nu downloaden in het dashboard.',
    time: '2 uur geleden',
    category: 'Boekhouder',
    icon: 'account_balance',
    read: false,
    priority: 'high'
  },
  {
    id: 2,
    title: 'Systeem',
    content: 'Nieuwe factuur ontvangen van Microsoft B.V. voor €299,00.',
    time: '1 dag geleden',
    category: 'Facturen',
    icon: 'receipt_long',
    read: true,
    priority: 'normal'
  },
  {
    id: 3,
    title: 'Systeem',
    content: 'Uw maandelijkse rapport is beschikbaar. Bekijk hier uw financiële overzicht.',
    time: '2 dagen geleden',
    category: 'Systeem',
    icon: 'analytics',
    read: true,
    priority: 'normal'
  }
])

const filteredMessages = computed(() => {
  if (activeCategory.value === 'all') return messages.value
  return messages.value.filter(msg => msg.category.toLowerCase() === activeCategory.value)
})

const markAsRead = (id: number) => {
  const message = messages.value.find(msg => msg.id === id)
  if (message) {
    message.read = true
  }
}

const deleteMessage = (id: number) => {
  messages.value = messages.value.filter(msg => msg.id !== id)
}
</script>

<style scoped>
.material-icons {
  font-size: 20px;
}
</style> 